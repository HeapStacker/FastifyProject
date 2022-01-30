export const registerUserSchema = {
    summary: "Register a new user.",
    tags: ["users"],
    description: "Register user model",
    body: {
        type: "object",
        required: ["firstName", "lastName", "email", "username", "password", "dateOfBirth", "country", "city"],
        properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string", format: "email" },
            username: { type: "string" },
            password: { type: "string" },
            dateOfBirth: { type: "string" }, //format: "date" ne radi dobro
            country: { type: "string" },
            city: { type: "string" },
        }
    },
    response: {
        201: {
            type: "object",
            properties: {
                message: { type: "string" },
                fingerprint: { type: "string" }
            }
        },
        400: {
            type: "string"
        },
        500: {
            type: "string"
        }
    }
}

export const validateUserSchema = {
    summary: "Validate a user so that he can log in.",
    tags: ["users"],
    description: "Route that's generated for verifying the user.",
    params: {
        type: "object",
        properties: {
            fingerprint: { type: "string" }
        }
    },
    response: {
        201: { type: "string" },
        404: { type: "string" },
        500: { type: "string" }
    }
}

export const loginUserSchema = {
    summary: "Login route.",
    tags: ["users"],
    description: "Login user model",
    body: {
        type: "object",
        required: ["email", "password"],
        properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" }
        }
    },
    response: {
        201: {
            description: "User's loged in successfully.",
            type: "object",
            properties: {
                message: { type: "string" },
                token: { type: "string" }
            }
        },
        400: {
            description: "Mail & password are not correct.",
            type: "string"
        },
        401: {
            description: "Wrong password or email.",
            type: "string"
        },
        403: {
            description: "User's not validated.",
            type: "string"
        },
        500: {
            description: "Internal server error.",
            type: "string"
        }
    }
}

export const forgotPasswordSchema = {
    summary: "Send reset password link to your email.",
    tags: ["users"],
    body: {
        type: "object",
        required: ["email"],
        properties: {
            email: { type: "string", format: "email" }
        }
    },
    response: {
        201: {
            type: "object",
            properties: {
                message: { type: "string" },
                uniqid: { type: "string" }
            }
        },
        401: {
            type: "string"
        },
        500: {
            type: "string"
        }
    }
}

export const changeForgottenPasswordSchema = {
    summary: "Unique route where user can change his password (must be different than the old one).",
    tags: ["users"],
    params: {
        type: "object",
        properties: {
            uniqid: { type: "string" }
        }
    },
    body: {
        type: "object",
        properties: {
            newPassword: { type: "string" },
            repeatedNewPassword: { type: "string" }
        }
    },
    response: {
        201: {
            type: "string"
        },
        401: {
            type: "string"
        },
        500: {
            type: "string"
        }
    }
}