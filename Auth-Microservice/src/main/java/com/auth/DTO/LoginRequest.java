package com.auth.DTO;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

	@NotBlank(message = "Email is mandatory")
	@Email(message = "Invalid email format")
	private String email;
	
	
	@NotBlank(message = "Password is mandatory")
    private String password;
}
