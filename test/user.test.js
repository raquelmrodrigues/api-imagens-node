let app = require("../src/app");
let supertest = require("supertest");
const { getMaxListeners } = require("../src/app");
let request = supertest(app);

let mainUser = {name: "Victor", email: "victor@email.com", password: "123456"}

beforeAll(() =>{
    // insere usuário no banco
    return request.post("/user")
    .send(mainUser)
    .then(res => {})
    .catch(err => {console.log(err)})
})

afterAll(() => {
    // remove usuário inserido no banco
    return request.delete("/user/" + mainUser.email)
    .then(res => {})
    .catch(err => {console.log(err)})
})

describe("Cadastro de usuário", () => {

    test("Deve cadastrar um usuário com sucesso", () => {
        
        //gera um email único para teste
        let time = Date.now();
        let email = `${time}@email.com}`;

        let user = {name: "victor", email: email, password: "1234"};

        return request.post("/user").send(user).then(res => {
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email);

        }).catch(err => {
            fail(err);
        });
    })

    test("Deve impedir que um usuário se cadastre com dados vazios", () => {

        let user = {name: "", email: "", password: ""};

        return request.post("/user").send(user).then(res => {
            
            expect(res.statusCode).toEqual(400)

        }).catch(err => {
            fail(err);
        });
    }) 

    test("Deve impedir que um usuário se cadastre com um e-mail repetido", () => {

        let time = Date.now();
        let email = `${time}@email.com}`;

        let user = {name: "victor", email: email, password: "1234"};

        return request.post("/user").send(user).then(res => {
            
            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(email);

            return request.post("/user").send(user).then(res => {

                expect(re.statusCode).toEqual(400);
                expect(res.body.error).toEqual("E-mail já cadastrado");

            }).catch(err => {
                fail(err);
            })

        }).catch(err => {
            fail(err);
        });
    })
}) 

describe("Autenticação", () => {

    test("Deve retornar um token quando logar", () => {
        return request.post("/auth")
        .send({email: mainUser.email, password: mainUser.password})
        .then(res => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.token).toBeDefined();
        }).catch(err => {
            fail(err);
        })
    })

    test("Deve impedir que um usuário não cadastrado se logue", () => {
        return request.post("/auth")
        .send({email: "emailqualquer@email.com", password: "16368r34"})
        .then(res => {
            expect(res.statusCode).toEqual(403);
            expect(res.body.errors.email).toEqual("E-mail não cadastrado");
        }).catch(err => {
            fail(err);
        })
    })

    test("Deve retornar um token quando logar", () => {
        return request.post("/auth")
        .send({email: mainUser.email, password: mainUser.password})
        .then(res => {
            expect(res.statusCode).toEqual(200);
            expect(res.body.token).toBeDefined();
        }).catch(err => {
            fail(err);
        })
    })

    test("Deve impedir que um usuário se logue com a senha inválida", () => {
        return request.post("/auth")
        .send({email: mainUser.email, password: "senhaErrada"})
        .then(res => {
            expect(res.statusCode).toEqual(403);
            expect(res.body.errors.password).toEqual("Senha incorreta");
        }).catch(err => {
            fail(err);
        })
    })
})