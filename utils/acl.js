/**
 * Created by tech4GT on 8/13/17.
 */
const db = require('../db')

module.exports = {
    setRole: function (req, res, next) {
        if (req.user) {
            db.models.Admins.findOne({
                where: {
                    userId: req.user.dataValues.userId
                }
            }).then(function (adminData) {
                if (adminData) {
                    req.user.dataValues.role = {name: "admin", id: adminData.id}
                    return next();
                }
                db.models.Teachers.findOne({
                    where: {
                        userId: req.user.dataValues.userId
                    }
                }).then(function (teacherData) {
                    if (teacherData) {
                        req.user.dataValues.role = {name: "teacher", id: teacherData.id}
                        return next();
                    }
                    db.models.Students.findOne({
                        where: {
                            userId: req.user.dataValues.userId
                        }
                    }).then(function (stuData) {
                        if (stuData) {
                            req.user.dataValues.role = {name: "student", id: stuData.id}
                            return next();
                        }
                        else {
                            res.status(401).send({success: false, error: {message: 'please register as student or teacher'}});
                        }
                    })
                })
            })
        }
        else {
            console.log("Not logged in")
            next();
        }
    },
    ensureAdmin: function ensureAdmin(req, res, next) {
        if (req.user.dataValues.role.name == "admin") return next();
        res.status(401).send({success: false, error: {message: 'You are not an admin'}});

    },
    ensureTeacher: function (req, res, next) {
        if (req.user.dataValues.role.name == "admin" || req.user.dataValues.role.name == "teacher") return next();
        res.status(401).send({success: false, error: {message: 'You are neither an Admin nor a Teacher'}});

    },
    ensureStudentId: function (studentId) {
       return function(req,res,next){
            if (req.user.dataValues.role.name == "admin" || req.user.dataValues.role.name == "teacher") return next();

            else{
                if (req.params[studentId]== req.user.dataValues.userId){
                    return next();
                }
            }
           res.status(401).send({success: false, error: {message: 'You are not authorized!'}});

        }

    },
    ensureTeacherId:function(teacherId) {
        return function(req,res,next){
        if (req.user.dataValues.role.name == "admin") return next();

        if(req.user.dataValues.role.name == "teacher"){
            if (req.params[teacherId] == req.user.dataValues.userId){
                return next();
            }
        }
            res.status(401).send({success: false, error: {message: 'You are not authorized!'}});


    }},
    ensureOwnUser:function(id){
       return function(req, res, next) {
            if(req.user.dataValues.role.name == "admin") return next();
            if (req.params[id] == req.user.dataValues.userId) return next();
           res.status(401).send({success: false, error: {message: 'You are not authorised to delete this account'}});

        }
    },
    ensureUserLogin: function (req, res, next) {
        if (!req.user) {
            res.status(401).send({success: false, error: {message: 'Please login to continue'}});

        }
        else {
            next()
        }
    },
    ensureBatchOfStudent: function(batchId){
        return function(req,res,next){
            if (req.user.dataValues.role.name == "admin" || req.user.dataValues.role.name == "teacher") return next();

            db.models.StudentBatch.findAll({
                where:{
                    studentId:req.user.dataValues.role.id
                }
            }).then(function (batches) {
                for(var entry in batches){
                    if(batches[entry].dataValues.batchId==req.params[batchId]){
                        return next();
                    }
                }
                res.status(401).send({success: false, error: {message: 'You don\'t have the right to access batches other than yours!'}});


            })




        }},
    ensureBatchOfTeacher:function(batchId){
            return function(req,res,next){
            if (req.user.dataValues.role.name == "admin") return next();


            if (req.user.dataValues.role.name == "teacher"){
                db.models.Batches.findOne({
                    where:{
                        id:req.param[batchId],
                        teacherId:req.user.role.id
                    }
                }).then(function(batch){
                    if(!batch){
                        res.status(401).send({success: false, error: {message: 'You can have the access of your own batches only'}});
                    }
                    else{
                        return next();
                    }
                })

            }
            else{
                res.status(401).send({success: false, error: {message: 'You are not authorized'}});


            }

        }
    }
}