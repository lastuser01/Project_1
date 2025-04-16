let joi=require("joi");

module.exports.review_schema=joi.object({
    review:joi.object({
        author:joi.string().required(),
        rating:joi.string().required().min(1).max(5),
        comment:joi.string().required()
    }).required()
})