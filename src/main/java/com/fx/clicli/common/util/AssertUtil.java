package com.fx.clicli.common.util;

import com.fx.clicli.service.ServiceException;

public class AssertUtil {
     // 传递参数校验    
	public static void isArgsVaild(boolean statement,String msg) {
		if(statement) {
			throw new IllegalArgumentException(msg);
		}
	}
	// 结果参数校验
	public static void isChecked(boolean statement,String msg) {
		if(statement) {
			throw new ServiceException(msg);
		}
	}
}
