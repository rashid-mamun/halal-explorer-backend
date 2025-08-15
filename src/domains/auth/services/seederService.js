const Permission = require('../models/Permission');
const Role = require('../models/Role');
const { RESOURCES, ACTIONS, ROLES } = require('../../../shared/constants');

/**
 * Create default permissions
 */
const createDefaultPermissions = async () => {
  const permissions = [];

  // Create permissions for each resource and action
  for (const resource of Object.values(RESOURCES)) {
    for (const action of Object.values(ACTIONS)) {
      const permissionName = `${resource}:${action}`;
      const description = `Can ${action} ${resource}`;

      const existingPermission = await Permission.findOne({ name: permissionName });
      if (!existingPermission) {
        permissions.push({
          name: permissionName,
          description,
          resource,
          action,
          isActive: true
        });
      }
    }
  }

  if (permissions.length > 0) {
    await Permission.insertMany(permissions);
    console.log(`Created ${permissions.length} default permissions`);
  }

  return await Permission.find({ isActive: true });
};

/**
 * Create default roles with permissions
 */
const createDefaultRoles = async () => {
  const permissions = await Permission.find({ isActive: true });
  
  const roles = [
    {
      name: ROLES.ADMIN,
      description: 'System administrator with full access',
      permissions: permissions.map(p => p._id),
      isActive: true,
      isSystem: true
    },
    {
      name: ROLES.MANAGER,
      description: 'Manager with limited administrative access',
      permissions: permissions
        .filter(p => 
          p.resource !== RESOURCES.ADMIN && 
          p.action !== ACTIONS.MANAGE
        )
        .map(p => p._id),
      isActive: true,
      isSystem: true
    },
    {
      name: ROLES.EMPLOYEE,
      description: 'Employee with basic access',
      permissions: permissions
        .filter(p => 
          [ACTIONS.READ, ACTIONS.CREATE, ACTIONS.UPDATE].includes(p.action) &&
          ![RESOURCES.ADMIN, RESOURCES.USER].includes(p.resource)
        )
        .map(p => p._id),
      isActive: true,
      isSystem: true
    },
    {
      name: ROLES.CUSTOMER,
      description: 'Customer with read-only access',
      permissions: permissions
        .filter(p => 
          p.action === ACTIONS.READ &&
          ![RESOURCES.ADMIN, RESOURCES.USER].includes(p.resource)
        )
        .map(p => p._id),
      isActive: true,
      isSystem: true
    }
  ];

  for (const roleData of roles) {
    const existingRole = await Role.findOne({ name: roleData.name });
    if (!existingRole) {
      await Role.create(roleData);
      console.log(`Created role: ${roleData.name}`);
    }
  }

  return await Role.find({ isActive: true }).populate('permissions');
};

/**
 * Initialize the RBAC system
 */
const initializeRBAC = async () => {
  try {
    console.log('Initializing RBAC system...');
    
    // Create default permissions
    await createDefaultPermissions();
    
    // Create default roles
    await createDefaultRoles();
    
    console.log('RBAC system initialized successfully');
  } catch (error) {
    console.error('Error initializing RBAC system:', error);
    throw error;
  }
};

/**
 * Get all permissions
 */
const getAllPermissions = async () => {
  return await Permission.find({ isActive: true }).sort({ resource: 1, action: 1 });
};

/**
 * Get all roles with permissions
 */
const getAllRoles = async () => {
  return await Role.find({ isActive: true })
    .populate('permissions')
    .sort({ name: 1 });
};

/**
 * Get role by name
 */
const getRoleByName = async (roleName) => {
  return await Role.findOne({ name: roleName, isActive: true })
    .populate('permissions');
};

/**
 * Create custom role
 */
const createCustomRole = async (roleData) => {
  const { name, description, permissions } = roleData;
  
  // Check if role already exists
  const existingRole = await Role.findOne({ name });
  if (existingRole) {
    throw new Error('Role already exists');
  }

  // Validate permissions
  const validPermissions = await Permission.find({
    _id: { $in: permissions },
    isActive: true
  });

  if (validPermissions.length !== permissions.length) {
    throw new Error('Some permissions are invalid');
  }

  const role = await Role.create({
    name,
    description,
    permissions: validPermissions.map(p => p._id),
    isActive: true,
    isSystem: false
  });

  return await role.populate('permissions');
};

/**
 * Update role
 */
const updateRole = async (roleId, updateData) => {
  const { name, description, permissions } = updateData;
  
  // Check if role exists
  const existingRole = await Role.findById(roleId);
  if (!existingRole) {
    throw new Error('Role not found');
  }

  // Don't allow updating system roles
  if (existingRole.isSystem) {
    throw new Error('Cannot update system roles');
  }

  // Check if new name conflicts with existing role
  if (name && name !== existingRole.name) {
    const nameConflict = await Role.findOne({ name, _id: { $ne: roleId } });
    if (nameConflict) {
      throw new Error('Role name already exists');
    }
  }

  // Validate permissions if provided
  if (permissions) {
    const validPermissions = await Permission.find({
      _id: { $in: permissions },
      isActive: true
    });

    if (validPermissions.length !== permissions.length) {
      throw new Error('Some permissions are invalid');
    }

    updateData.permissions = validPermissions.map(p => p._id);
  }

  const updatedRole = await Role.findByIdAndUpdate(
    roleId,
    updateData,
    { new: true, runValidators: true }
  ).populate('permissions');

  return updatedRole;
};

/**
 * Delete role
 */
const deleteRole = async (roleId) => {
  const role = await Role.findById(roleId);
  if (!role) {
    throw new Error('Role not found');
  }

  // Don't allow deleting system roles
  if (role.isSystem) {
    throw new Error('Cannot delete system roles');
  }

  // Check if role is assigned to any users
  const User = require('../models/User');
  const usersWithRole = await User.countDocuments({ role: roleId });
  if (usersWithRole > 0) {
    throw new Error('Cannot delete role that is assigned to users');
  }

  await Role.findByIdAndDelete(roleId);
  return { message: 'Role deleted successfully' };
};

module.exports = {
  initializeRBAC,
  createDefaultPermissions,
  createDefaultRoles,
  getAllPermissions,
  getAllRoles,
  getRoleByName,
  createCustomRole,
  updateRole,
  deleteRole
};
