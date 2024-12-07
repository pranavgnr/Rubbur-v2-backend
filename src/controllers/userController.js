const Book = require('../models/book');
const mainBooksArray = require('../models/mainBooksArray');
const mongoose = require('mongoose');

exports.createBook = async (req,res) => {
    console.log(req.body);
    console.log(req.body.parentId);

    const { parentId, data, childrenIds } = req.body;
    console.log(parentId, data, childrenIds);

    const book = new Book({
        parentId: parentId,
        data: data,
        ChildrenId: childrenIds
    });

    try {
        if(parentId == ''){
            const newBook = await book.save();

            try {
                const mainArrayAddition = await mainBooksArray.findByIdAndUpdate(
                    '6736e490ba423c04acf748d0',
                    {$push: {arrayOfIds: newBook.id}},
                    {new: true}
                )
            } catch (error) {
                console.log(error);
            }
            res.status(201).json(newBook,mainArrayAddition);
        } else {
            const newBook = await book.save();
            console.log(newBook);
            try {
                let parentUpdate = await Book.findByIdAndUpdate(
                    parentId,
                    {$push: {ChildrenId: newBook.id}},
                    {new: true}
                )
                res.status(200).send(parentUpdate);
            } catch (error) {
                res.status(400).send("error when updating child Id in parent Book: ", error);
            }
        }
    } catch (error) {
        res.status(400).json({ message: "error"+error})
    }
}

exports.getBooks = async (req,res) => {
    try {
        const data = await mainBooksArray.find();
        let mainData = '';
        
        try{
            const info = await Book.find( {_id: { $in: data[0].arrayOfIds}});
            mainData = info;
        } catch (error) {
            console.log("error: "+error);
        }
        res.status(200).send(mainData);
    } catch (error) {
        res.status(400).send(error);
    }
}

exports.getOtherBooks = async (req,res) => {
    try {
        parentId = req.body.parentId;
        const data = await Book.findById(parentId);
        array = [];

        data.ChildrenId.forEach(element => {
            array.push(element);
        });
    } catch(error) {
        res.status(400).send(error);
    }

    if(array != []) {
        try {
            let books = await Book.find({ _id: { $in: array } })
            res.status(200).send(books);
        } catch (error) {
            res.status(400).send(error);
        }
    }
}

exports.deleteBook = async (req,res) => {
    let idToDelete = req.body.parentId;
    let data;
    let parentIdWhereChildHasToBeDeleted;

    try {
        const z = await Book.findById(idToDelete);
        parentIdWhereChildHasToBeDeleted = z.parentId;
    } catch (error) {
        console.log(error);
    }

    if(parentIdWhereChildHasToBeDeleted == '') {
        try {
            const mainArrayInfoDel = await mainBooksArray.findByIdAndUpdate(
                '6736e490ba423c04acf748d0',
                {$pull: {arrayOfIds: idToDelete}}
            )
        } catch (error) {
            console.log(error);
        }
    } else {
        try {
            const parentData = await Book.findByIdAndUpdate(
                parentIdWhereChildHasToBeDeleted,
                { $pull: { ChildrenId: idToDelete}}
            );
        } catch (error) {
            res.status(400).send(error);
        }
    }

    try {
        data = await Book.findById(idToDelete);
        try {
            const del = await Book.findByIdAndDelete(idToDelete);
        } catch (error) {
            console.log(error);
        }
    } catch(error) {
        res.status(400).send(error);
    }

    let childrenIdData = data.ChildrenId;

    try {
        await recursiveCallForDeletion(childrenIdData);
    } catch (error) {
        console.log(error);
    }
    
}

exports.updateBook = async (req, res) => {
    let dataToUpdate = req.body.data;
    try {
        const data = await Book.findByIdAndUpdate(
            req.body.id,
            {data: dataToUpdate}
        )
        res.status(200).send("Updated to: "+data);
    } catch (error) {
        res.status(400).send(error);
    }
}

async function recursiveCallForDeletion(data) {
    childrenData = [];
    try {
        const ff = await Book.find({_id: {$in: data}});
    } catch(error) {
        console.log(error);
    }

    for(let z=0; z<data.length; z++) {
        try {
            let childrenInfo = await Book.findById(data[z]);
            if(childrenInfo && childrenInfo.ChildrenId.length > 0) {
                childrenInfo.ChildrenId.forEach(element => {
                    childrenData.push(element);
                });
            }

            try {
                const delData = await Book.findByIdAndDelete(childrenInfo.id);
            } catch(error) {
                console.log(error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    if(childrenData.length > 0){
        recursiveCallForDeletion(childrenData);
    }
}

