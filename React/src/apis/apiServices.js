import { request } from "../utilities/apiService";
import { HOST } from "../App.config";

export function getAlRequest() {
    return request(HOST + "getAllRequest", "get", {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("userToken"),
    })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
}

export function registerUser(name, email, password) {
    const requestBody = {
        name: name,
        email: email,
        password: password,
    };
    return request(
        HOST + "register",
        "post",
        {
            "Content-Type": "application/json",
        },
        requestBody,
    )
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
}

export function login(email, password) {
    const requestBody = {
        email: email,
        password: password,
    };
    return request(
        HOST + "login",
        "post",
        {
            "Content-Type": "application/json",
        },
        requestBody,
    )
        .then((response) => {
            console.log(response);
            if (
                response.data.status === -1 ||
                response.data.status === 0 ||
                response.data.status === -2
            ) {
                return response.data;
            } else {
                localStorage.setItem("userToken", response.data.token);
                localStorage.setItem("userRole", response.data.role);
                localStorage.setItem("userEmail", email);
                return response.data;
            }
        })
        .catch((err) => {
            throw err;
        });
}

export function resetPassword(name, email, password) {
    const requestBody = {
        name: name,
        email: email,
        password: password,
    };
    return request(
        HOST + "resetPassword",
        "post",
        {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("userToken"),
        },
        requestBody,
    )
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
}

export function addImage(title, document, caseValue) {
    let form = new FormData();
    form.append("title", title);
    form.append("document", document);
    form.append("case", caseValue);
    return request(
        HOST + "image",
        "post",
        {
            "Content-Type": "multipart/form-data",
            authorization: "Bearer " + localStorage.getItem("userToken"),
        },
        form,
    )
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
}

export function addCase(title, description) {
    let object = {
        title,
        description,
    };
    return request(
        HOST + "addCase",
        "post",
        {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("userToken"),
        },
        object,
    )
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
}

export function getCases() {
    return request(HOST + "cases", "get", {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("userToken"),
    })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
}

export function getImages(caseId) {
    return request(HOST + "images/" + caseId, "get", {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("userToken"),
    })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
}

export function removeImage(imageId) {
    return request(HOST + "images/" + imageId, "delete", {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("userToken"),
    })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
}

export function updateRequest(requestId, currentStatus) {
    return request(
        HOST + "request",
        "post",
        {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("userToken"),
        },
        {
            userId: requestId,
            status: currentStatus,
        },
    )
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            throw error;
        });
}
