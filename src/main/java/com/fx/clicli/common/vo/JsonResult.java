package com.fx.clicli.common.vo;

import java.io.Serializable;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class JsonResult implements Serializable {
	private static final long serialVersionUID = 1991944920688267873L;
	/** 状态码:用于标识服务端返回客户端的数据是正常还是异常数据 */
	private int state = 1; // 默认为1表示ok,0表示error
	/** 状态码对应的消息 */
	private String message = "ok";
	/** 通过此属性存储业务层的正常数据 */
	private Object data;
	
	public JsonResult(String message) {
		this.message = message;
	}
	public JsonResult(Object data) {
		this.data = data;
	}
	public JsonResult(Throwable e) {
		this.state=0;
		this.message=e.getMessage();
	}
}