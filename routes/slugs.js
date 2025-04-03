var express = require('express');
var router = express.Router();
let productModel = require('../schemas/product');
let CategoryModel = require('../schemas/category');


router.get('/:categorySlug', async function(req, res, next) {
  try {
    const categorySlug = req.params.categorySlug;
  
    const category = await CategoryModel.findOne({ slug: categorySlug });
    
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found"
      });
    }
    

    const products = await productModel.find({ 
      category: category._id,
      isDeleted: { $ne: true }
    }).populate("category");
    
    res.status(200).send({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

router.get('/:categorySlug/:productSlug', async function(req, res, next) {
  try {
    const { categorySlug, productSlug } = req.params;
    
    const category = await CategoryModel.findOne({ slug: categorySlug });
    
    if (!category) {
      return res.status(404).send({
        success: false,
        message: "Category not found"
      });
    }
    
    const product = await productModel.findOne({
      slug: productSlug,
      category: category._id,
      isDeleted: { $ne: true }
    }).populate("category");
    
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found"
      });
    }
    
    res.status(200).send({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;