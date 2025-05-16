
export const asyncHandler=(fn)=>{
    return (request,response,next)=>{
      fn(request,response,next).catch((error)=>{
        return next(error)
      })
    }
  }


  export const globalErrorHandler=(error,request,response,next)=>{
    if(process.env.MODE=="DEV"){
      return response.status(error["cause"] || 500).json({
        message:error.message,
        stack:error.stack, 
        error
      })
    }
    return response.status(error["cause"] || 500).json({
      message:error.message,
    })
  }