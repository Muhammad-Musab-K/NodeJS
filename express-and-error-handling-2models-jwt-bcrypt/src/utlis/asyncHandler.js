// const asyncHandler = (fuc) => {}
// const asyncHandler = (fuc) => {()=>{}} //high order functions use to handle the db response ,, we create it to make our code and life easier
// const asyncHandler = (func) = async(req, res, next) => {
//     try {
//         await func(req, res, next)

//     } catch (err) {
//         res.status(err.code || 500).josn({
//             success: false,
//             message: err.message
//         })
//     }
// }

// the upper method is correct but we have another method 

const asyncHandler = async (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch(err => next(err));
    };
};

export { asyncHandler };