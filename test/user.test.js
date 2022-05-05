let app = require("../src/app");
let supertest = require("supertest");
const { getMaxListeners } = require("../src/app");
let request = supertest(app);

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
}) 