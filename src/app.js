const express = require('express');
const morgan = require('morgan')
const config = require('../config')
//Swagger
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Venta de automotores',
            version: '1.0.2'
        }
    },
    apis: ['./src/app.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Importacion de archivos particulares

const { arrayInfo } = require('./info');
const { existeAutomotor } = require('./middleware');

// Inicializacion del server
const app = express();

app.use(express.json());
app.use(morgan('dev'));



/**
 * @swagger
 * /:
 *  get:
 *    summary: programa
 *    description : Listado de autores y sus libros
 *    responses:
 *     200: 
 *       description: programa
 */
app.get('/', function (req, res) {
    res.send({ programa: "Automotores v1.0.0" })
})

/**
 * @swagger
 * /automotores:
 *  get:
 *    summary: automotores
 *    description: Listado de automotores
 *    responses:
 *       200:
 *         description: Listado de autores
 */
app.get('/automotores', function (req, res) {
    console.log(arrayInfo);
    res.send(arrayInfo);
});

/**
 * @swagger
 * /automotores:
 *  post:
 *    summary: automotores.
 *    description : Listado de automotores.
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: automotores
 *        description: Automotor a crear
 *        schema:
 *          type: object
 *          required:
 *            - id
 *          properties:
 *            id:
 *              description: ID de automotor a agregar
 *              type: integer
 *            marca:
 *              description: Marca del automotor
 *              type: string
 *            modelo:
 *              description: Modelo del automotor
 *              type: string
 *            fechaFabricacion:
 *              description: Fecha de fabricacion del automotor
 *              type: string
 *            cantidadPuertas:
 *              description: Cantidad de puertas del automotor
 *              type: integer
 *            disponibleVenta:
 *              description: Disponiniblidad de venta
 *              type: boolean
 *    responses:
 *      201:
 *       description: Agregado de automotor
 *      
 */
app.post('/automotores', function (req, res) {
    let auto = req.body;
    console.log(req.body);
    arrayInfo.push(auto);
    res.send(auto);
});


/**
 * @swagger
 * /automotores/{id}:
 *  get:
 *    summary: Recupera la informaci??n de un automotor seg??n su ID
 *    description: Informaci??n de un automotores.
 *    parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del auto a recuperar.
 *         schema:
 *           type: integer
 *           example: 1
 *    responses:
 *       200:
 *        description: Listado ok.
 *       404:
 *        description: Automotor no encontrado.  
*/
app.get('/automotores/:id', existeAutomotor, function (req, res) {
    let auto = req.auto;
    console.log(auto);
    res.send(auto);
});

/**
 * @swagger
 * /automotores/{id}:
 *  delete:
 *    summary: Eliminar un automotor seg??n su ID
 *    description: Elimina el automotor.
 *    parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del auto a eliminar.
 *         schema:
 *           type: integer
 *           example: 1
 *    responses:
 *       200:
 *        description: Automotor eliminado correctamente.
 *       404:
 *        description: Automotor no encontrado.  
 */
app.delete('/automotores/:id', existeAutomotor, function (req, res) {
    let auto = req.auto
    let index = req.index
    resultado = 'Borrado seg??n el indice: ' + index
    arrayInfo.splice(index, 1);
    res.send({ resultado: resultado, valor: auto });
});



/**
 * @swagger
 * /automotores/{id}:
 *  put:
 *    summary: Modificaci??n de automotor segun ID.
 *    description : Modificaci??n de automotor segun ID.
 *    consumes:
 *      - application/json
 *    parameters:
 *      - name: id
 *        in: path
 *        description: name that need to be updated
 *        required: true
 *        type: integer
 *      - in: body
 *        name: automotores
 *        description: Automotor a modificar
 *        schema:
 *          type: object
 *          required:
 *            - id
 *          properties:
 *            id:
 *              description: ID de automotor a modificar
 *              type: integer
 *            marca:
 *              description: Marca del automotor
 *              type: string
 *            modelo:
 *              description: Modelo del automotor
 *              type: string
 *            fechaFabricacion:
 *              description: Fecha de fabricacion del automotor
 *              type: string
 *            cantidadPuertas:
 *              description: Cantidad de puertas del automotor
 *              type: integer
 *            disponibleVenta:
 *              description: Disponiniblidad de venta
 *              type: boolean
 *    responses:
 *      201:
 *       description: Agregado de automotor
 *      
 */
app.put('/automotores/:id', existeAutomotor, function (req, res) {
    let autoNuevo = req.body;
    let index = req.index
    resultado = 'Actualizaci??n seg??n el indice: ' + index
    arrayInfo[index] = autoNuevo;
    res.send({ resultado: resultado, valor: autoNuevo });
});


app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));
// view in localhost:5000/api-docs

app.listen(config.port, function () {
    console.log(`Escuchando el puerto ${config.port}!`);
});