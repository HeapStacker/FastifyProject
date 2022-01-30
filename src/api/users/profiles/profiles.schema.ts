export const accessProfileSchema = {
    summary: "Access me profile page where you can edit and watch your info.",
    tags: ["profiles"],
    querystring: {
        type: "object",
        properties: {
            token: { type: "string" }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                message: { type: "string" },
                data: {
                    type: "object",
                    properties: {
                        username: { type: "string" },
                        description: { type: "string" }
                    }
                },
                visibility: {
                    type: "object",
                    properties: {
                        nameVisibility: { type: "string" },
                        descriptionVisibility: { type: "string" },
                        placeVisibility: { type: "string" },
                        dobVisibility: { type: "string" },
                    }
                },
                newToken: { type: "string" }
            }
        },
        401: { type: "string" },
        404: {
            type: "object",
            properties: {
                message: { type: "string" },
                newToken: { type: "string" }
            }
        },
        500: { type: "string" }
    }
}

export const getSomeonesProfileSchema = {
    summary: "Watch someone else's profile (You can only see his/hers visible information).",
    tags: ["profiles"],
    params: {
        type: "object",
        properties: {
            id: { type: "string" }
        }
    },
    querystring: {
        type: "object",
        properties: {
            token: { type: "string" }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                data: {
                    type: "object",
                    properties: {
                        username: { type: "string" },
                        name: {
                            type: "object",
                            properties: {
                                firstname: { type: "string" },
                                lastName: { type: "string" }
                            }
                        },
                        description: { type: "string" },
                        place: {
                            type: "object",
                            properties: {
                                country: { type: "string" },
                                city: { type: "string" },
                                town: { type: "string" },
                                vilage: { type: "string" }
                            }
                        }
                    }
                },
                newToken: { type: "string" }
            }
        },
        404: {
            type: "object",
            properties: {
                message: { type: "string" },
                newToken: { type: "string" }
            }
        },
        500: { type: "string" }
    }
}

export const followSomeoneSchema = {
    summary: "Follow someone.",
    tags: ["profiles"],
    params: {
        type: "object",
        properties: {
            username: { type: "string" }
        }
    },
    querystring: {
        type: "object",
        properties: {
            token: { type: "string" }
        }
    },
    response: {
        201: {
            message: { type: "string" },
            newToken: { type: "string" }
        },
        401: { type: "string" },
        404: {
            type: "object",
            properties: {
                message: { type: "string" },
                newToken: { type: "string" }
            }
        },
        500: { type: "string" }
    }
}

export const getFollowersSchema = {
    summary: "Get the list of everyone that's following you.",
    tags: ["profiles"],
    querystring: {
        type: "object",
        properties: {
            token: { type: "string" }
        }
    },
    response: {
        200: {
            type: "object",
            properties: {
                followers: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            uuid: { type: "string" },
                            email: { type: "string" },
                            username: { type: "string" }
                        }
                    }
                },
                newToken: { type: "string" }
            }
        },
        401: {
            type: "string"
        },
        404: {
            type: "object",
            properties: {
                message: { type: "string" },
                newToken: { type: "string" }
            }
        },
        500: { type: "string" }
    }
}

export const logOutSchema = {
    summary: "Simply log out from your account.",
    tags: ["profiles"],
    querystring: {
        type: "object",
        properties: {
            token: { type: "string" }
        }
    },
    response: {
        201: { type: "string" },
        500: { type: "string" }
    }
}

export const changePasswordSchema = {
    summary: "In order to change your password while you're logged in, you must also provide your old password.",
    tags: ["profiles"],
    querystring: {
        type: "object",
        properties: {
            token: { type: "string" }
        }
    },
    body: {
        oldPassword: { type: "string" },
        newPassword: { type: "string" },
        newRepeatedPassword: { type: "string" }
    },
    response: {
        201: {
            type: "object",
            properties: {
                message: { type: "string" },
                newToken: { type: "string" }
            }
        },
        400: {
            type: "object",
            properties: {
                message: { type: "string" },
                newToken: { type: "string" }
            } 
        },
        401: { type: "string" },
        500: { type: "string" }
    }
}

export const removeAccountSchema = {
    summary: "Instantly remove your account and connections to other users(followers).",
    tags: ["profiles"],
    querystring: {
        type: "object",
        properties: {
            token: { type: "string" }
        }
    },
    body: {
        passwordCheck: { type: "string" }
    },
    response: {
        400: {
            type: "object",
            properties: {
                message: { type: "string" },
                newToken: { type: "string" }
            } 
        },
        401: { type: "string" },
        404: { type: "string" },
        500: { type: "string" }
    }
}

export const uploadProfilePictureSchema = {
    summary: "Upload a new profile picture.",
    tags: ["profiles"],
    querystring: {
        type: "object",
        properties: {
            token: { type: "string" }
        }
    },
    body: {
      type: 'object',
      properties: {
        file: { type: 'object' }
      }
    },
    response: {
        201: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    mimetype: { type: "string" }
                }
            }
        },
        500: { type: "string" }
    }
}