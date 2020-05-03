package com.fx.clicli.service;

/**
 * 自定义异常
 * 说明:一般自定义异常:需要具备一定的业务含义,java中自定义异常通常继承RuntimeException
 * 编译器不对此类异常进行检查
 *
 */
public class ServiceException extends RuntimeException {



	public ServiceException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
		super(message, cause, enableSuppression, writableStackTrace);
	}

	public ServiceException(String message) {
		super(message);
	}



}
