package com.fx.clicli.web;


import org.springframework.web.bind.annotation.ExceptionHandler;

import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.fx.clicli.common.vo.JsonResult;



/**
 * 全局异常处理类
 * 被@ControllerAdvice注解
 * @author 17879
 *
 */
@RestControllerAdvice 
public class GlobalExceptionHandler {
	
	/**
	 * 被@ExceptionHandler注解描述的方法为异常处理方法,此注解中定义的异常类型
	 * 为所描述的方法可以处理的异常类型
	 * @param e 与@ExceptionHandler注解定义的异常保持一致
	 * @return
	 */
	@ExceptionHandler(RuntimeException.class)
	public JsonResult doHandleRuntimeException(RuntimeException e) {
		return new JsonResult(e);
	}
	
	
}
