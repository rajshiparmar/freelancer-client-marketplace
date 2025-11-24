package com.freelancer.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.OK)
public class ClientNotFoundException  extends RuntimeException{

	public ClientNotFoundException(String message) {
		super(message);
		}

}
