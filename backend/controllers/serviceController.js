import Service from "../models/Service.js";

const ServiceController = {

    create: async(req, res) => {
        try {
            
            const service = {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                image: req.body.image,
            };

            const response = await Service.create(service);

            res.status(201).json({ response, msg: "Serviço criado com sucesso!" });

        } catch (error) {
            console.log(error);
        }
    },
    getAll: async(req, res) => {
        try {
            const services = await Service.find();
            if(!services) {
                res.status(404).json({ services, mgs: "Serviços não encontrados. Cadastre um!" });
                return;
            }
            res.json(services);
        } catch (error) {
            console.log(error);
        }
    },
    get: async(req, res) => {
        try {
            // id => URL === GET ( através dos parâmetros passados pela URL)
            const id = req.params.id;
            const service = await Service.findById(id);
            if(!service) {
                res.status(404).json({ mgs: "Serviço não encontrado." });
                return;
            }
            res.json(service);
        } catch (error) {
            console.log(error);
        }
    },
    delete: async (req, res) => {
        try {
            const id = req.params.id;

            const service = await Service.findById(id);

            if(!service) {
                res.status(404).json({ mgs: "Serviço não encontrado." });
                return;
            }

            const deletedService = await Service.findByIdAndDelete(id);

            res.status(200).json({deletedService, msg: "Serviço excluído com sucesso."});
        } catch (error) {
            console.log(error);
        }
    },
    update: async (req, res) => {
        try {
            
            const id = req.params.id;

            const service = {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                image: req.body.image,
            };

            const updatedService = await Service.findByIdAndUpdate(id, service);

            if(!updatedService) {
                res.status(404).json({ mgs: "Serviço não encontrado." });
                return;
            }

            res.status(200).json({ updatedService, msg: "Serviço atualizado com sucesso!" });

        } catch (error) {
            console.log(error);
        }
    },
};

export default ServiceController;
