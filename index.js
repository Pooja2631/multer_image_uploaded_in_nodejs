const express=require('express');
const app=express();
const multer=require('multer');
const MulterSharpResizer=require('multer-sharp-resizer');

app.use(express.static(`${__dirname}/public`))
app.use(express.json());

const multerStorage=multer.memeroyStorage();


// filter files with multer
const multerFilter=(req,file,cb)=>{
    if(file.mimetype.startsWith("image")){
        cb(null, true);
    }else{
        cb(null ,false);
    }
}

const upload=multer({
    storage:multerStorage,
    fileFilter:multerFilter
});


//multer .fileds()
const uploadProductImages=upload.fileds([
    {name:"cover",maxCount:1},
    {name:"gallery",maxCount:4}
]);


const resizerImages=async(req,res,next)=>{
    const today=new Date();
    const year=today.getFullYear();
    const month=`${today.getMonth+1}`.padStart(2,"0");

    const filename={
        cover:`cover-${Date.now()}`,
        gallery:`gallery-${Date.now()}`
    }


    const sizes = [{
        path:'original',
        width:null,
        height:null
    },
    {
        path:'large',
        width:600,
        height:300
    },
    {
        path:'medium',
        width:300,
        height:160
    },
    {
        path:'thumbnall',
        width:150,
        height:150
    },
];

const uploadPath=`./public/uploads/${year}/${month}`;
const fileUrl=`${req.protocol}://${req.get('host')}/uploads/${year}/${month}`;


// sharp options
const sharpOptions={
    fit:"contain",
    background:{r:255,g:255,b:255}
};



const resizeObj=new MulterSharpResizer(
    req,
    filename,
    sizes,
    uploadPath,
    fileUrl,
    sharpOptions
);

//call resize method for resizing files
await resizeObj.resize();
const detDataUploaded=resizeObj.getData();


// get details of uploaded files: used by multer fields
req.body.cover=getDataUploaded.cover;
req.body.gallery=getDataUploaded.gallery


next();


}


const createProduct=async(req,res,next)=>{
    res.status(201).json({
        status:`success`,
        cover:req.body.cover,
        gallery:req.body.gallery
    })
};

//route for see results of uploaded images
app.post("/products",uploadProductImages,resizerImages,createProduct)


const port=8000;
app.listen(port,()=>console.log("server runing on port 8000..."))
;