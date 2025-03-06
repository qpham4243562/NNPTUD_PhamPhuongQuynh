var express = require('express');
const { ConnectionCheckOutFailedEvent } = require('mongodb');
var router = express.Router();
let productModel = require('../schemas/product')

function buildQuery(obj){
  console.log(obj);
  let result = {};
  if(obj.name){
    result.name=new RegExp(obj.name,'i');
  }
  result.price = {};
  if(obj.price){
    if(obj.price.$gte){
      result.price.$gte = obj.price.$gte;
    }else{
      result.price.$gte = 0
    }
    if(obj.price.$lte){
      result.price.$lte = obj.price.$lte;
    }else{
      result.price.$lte = 10000;
    }
    
  }
  result.isDeleted = { $ne: true };
  return result;
}

router.get('/', async function(req, res, next) {
  

  let products = await productModel.find(buildQuery(req.query));

  res.status(200).send({
    success:true,
    data:products
  });
});
router.get('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let product = await productModel.findById(id);
    
    if (!product || product.isDeleted) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy sản phẩm hoặc sản phẩm đã bị xóa"
      });
    }
    
    res.status(200).send({
      success:true,
      data:product
    });
  } catch (error) {
    res.status(404).send({
      success:false,
      message:"khong co id phu hop"
    });
  }
});

router.post('/', async function(req, res, next) {
  try {
    let newProduct = new productModel({
      name: req.body.name,
      price:req.body.price,
      quantity: req.body.quantity,
      category:req.body.category,
      isDeleted: false
    })
    await newProduct.save();
    res.status(200).send({
      success:true,
      data:newProduct
    });
  } catch (error) {
    res.status(404).send({
      success:false,
      message:error.message
    });
  }
});

router.put('/:id', async function(req, res, next) {
  try {
    const id = req.params.id;

    const existingProduct = await productModel.findById(id);
    if (!existingProduct || existingProduct.isDeleted) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy sản phẩm hoặc sản phẩm đã bị xóa"
      });
    }

    const updatedData = {
      name: req.body.name || existingProduct.name,
      price: req.body.price || existingProduct.price,
      quantity: req.body.quantity || existingProduct.quantity,
      category: req.body.category || existingProduct.category
    };
    
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true } 
    );
    
    res.status(200).send({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      data: updatedProduct
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

// DELETE route for soft delete
router.delete('/:id', async function(req, res, next) {
  try {
    const id = req.params.id;
    
    // Check if product exists
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Không tìm thấy sản phẩm"
      });
    }
    
    if (product.isDeleted) {
      return res.status(400).send({
        success: false,
        message: "Sản phẩm đã được xóa trước đó"
      });
    }
    
    // Soft delete by updating isDeleted field
    const deletedProduct = await productModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    
    res.status(200).send({
      success: true,
      message: "Xóa sản phẩm thành công",
      data: deletedProduct
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;