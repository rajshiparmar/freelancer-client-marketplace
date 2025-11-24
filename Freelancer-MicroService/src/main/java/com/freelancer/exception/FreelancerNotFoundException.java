package com.freelancer.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class FreelancerNotFoundException extends RuntimeException{

	public FreelancerNotFoundException(String message) {
		super(message);
	}

	
}
