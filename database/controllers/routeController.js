const {Route} = require('../model/models');
const path = require('path');
const uuid = require('uuid');
const ApiError = require('../error/ApiError');
const { response } = require('express');

class RouteController {
    async create(request, response, next) {
        try {
            const {from, to, price, dateTime, shortDescription, fullDescription} = request.body;

            // const {img} = request.files;
            let imageName = uuid.v4() + ".jpg";
            // if(img) {
            //     img.mv(path.resolve(__diranme, '..', 'static', fileName));
            // }

            const route = await Route.create({from, to, price, dateTime, imageName, shortDescription, fullDescription});
            return response.json(route);
        } catch (error) {
            next(ApiError.badRequest(error.message));
        }

    }
    async read(request, response) {
        let {page, limit} = request.query;
        page = page;
        limit = limit;
        let routes;
        if(page && limit) {
            let offset = page * limit - limit;
            routes = await Route.findAll({limit, offset});
        } else {
            routes = await Route.findAll();
        }
        response.json(routes);
    }
    async readById (request, response) {
        const {id} = request.params;
        const route = await Route.findOne({where: {id: id}});
        response.json(route);
    }
}

module.exports = new RouteController();





























// const dbPool = require('../db');

// class RouteController {
//     async createRoute(request, response) {
//         const {from, to, price, dateTime, imageName, shortDescription, fullDescription} = request.body;
//         const addedRoute = await dbPool.query('insert into route ("from", "to", price, dateTime, imageName, shortDescription, fullDescription) values ($1, $2, $3, $4, $5, $6, $7)', [from, to, price, dateTime, imageName, shortDescription, fullDescription]);
//         response.send(addedRoute);
//     }
//     async readRoutes(request, response) {
//         const routesArray = await dbPool.query('select * from route');
//         response.send(routesArray.rows);
//         return routesArray.rows;
//     }
//     async readRouteById(request, response) {
//         const id = request.params.id;
//         const currentRoute = await dbPool.query('select * from route where id = $1', [id]); 
//         response.json(currentRoute.rows[0]);
//     }
//     async updateRoute(request, response) {
//         const {id, from, to, price, dateTime, imageName, shortDescription, fullDescription} = request.body;
//         const updatedRoute = await dbPool.query('update route set "from" = $1, "to" = $2, price = $3, dateTime = $4, imageName = $5, shortDescription = $6, fullDescription = $7 where id = $8 returning *', [from, to, price, dateTime, imageName, shortDescription, fullDescription, id]);
//         response.json(updatedRoute.rows[0]);
//     }
//     async deleteRoute(request, response) {
//         const id = request.params.id;
//         const deletedRoute = await dbPool.query('delete from route where id = $1 returning *', [id]);
//         response.json(deletedRoute.rows[0]);
//     }
// }

// module.exports = new RouteController();