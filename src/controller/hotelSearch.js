const express = require('express');
const { getClient } = require("../config/database");

exports.hotelSearch = async (req, res) => {
    try {
        const client = getClient();
        const db = client.db(process.env.DbName);
        const collection = db.collection(process.env.collectionName);

        const keyword = "Linfen";

        // Create the text index
        await collection.createIndex({ address: "text" });

        // Perform the text search query and retrieve only the id field
        const query = { $text: { $search: keyword } };
        const projection = { _id: 1 };
        const cursor = collection.find(query, projection).limit(300);

        // Extract the id field from each document
        const ids = [];
        await cursor.forEach(doc => ids.push(doc.id));


        console.log("IDs found:\n", JSON.stringify(ids));
        res.status(200).json({ids});

    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: 'There was a server side error!',
        });
    }
};
