const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = require('../schemas/category');


router.post('/', async (req, res) => {
    try {
      const newCategory = new Category({
        name: req.body.name,
        description: req.body.description || "",
        isDeleted: false 
      });
  
      const savedCategory = await newCategory.save();
      res.status(201).send({
        success: true,
        message: "Tạo category thành công",
        data: savedCategory
      });
    } catch (error) {
      res.status(400).send({
        success: false,
        message: error.message
      });
    }
  });

  router.get('/', async (req, res) => {
    try {
      const categories = await Category.find({ isDeleted: { $ne: true } });
      res.status(200).send({
        success: true,
        data: categories
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Lỗi server: " + error.message
      });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
          success: false,
          message: "ID không hợp lệ"
        });
      }
  
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).send({
          success: false,
          message: "Không tìm thấy category"
        });
      }
  
      if (category.isDeleted) {
        return res.status(404).send({
          success: false,
          message: "Category đã bị xóa"
        });
      }
  
      res.status(200).send({
        success: true,
        data: category
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Lỗi server: " + error.message
      });
    }
  });
  router.put('/:id', async (req, res) => {
    try {
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
          success: false,
          message: "ID không hợp lệ"
        });
      }
  
      const existingCategory = await Category.findById(id);
      if (!existingCategory) {
        return res.status(404).send({
          success: false,
          message: "Không tìm thấy category"
        });
      }
  
      if (existingCategory.isDeleted) {
        return res.status(404).send({
          success: false,
          message: "Category đã bị xóa, không thể cập nhật"
        });
      }
  
      const updatedData = {
        name: req.body.name || existingCategory.name,
        description: req.body.description || existingCategory.description
      };
  
      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        updatedData,
        { new: true }
      );
  
      res.status(200).send({
        success: true,
        message: "Cập nhật category thành công",
        data: updatedCategory
      });
    } catch (error) {
      res.status(400).send({
        success: false,
        message: error.message
      });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
          success: false,
          message: "ID không hợp lệ"
        });
      }
  
      const category = await Category.findById(id);
      if (!category) {
        return res.status(404).send({
          success: false,
          message: "Không tìm thấy category"
        });
      }
  
      if (category.isDeleted) {
        return res.status(400).send({
          success: false,
          message: "Category đã được xóa trước đó"
        });
      }
  
      const deletedCategory = await Category.findByIdAndUpdate(
        id,
        { isDeleted: true }, 
        { new: true }
      );
  
      res.status(200).send({
        success: true,
        message: "Xóa category thành công",
        data: deletedCategory
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Lỗi server: " + error.message
      });
    }
  });
module.exports = router;