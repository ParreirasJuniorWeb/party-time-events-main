import Party from "../models/Party.js";
// função auxiliar
const checkPartyBudget = (budget, services) => {

    const priceSum = services.reduce((sum, service) => sum + service.price, 0);

    if(priceSum > budget) {
        return false;
    }

    return true;
};

const partyController = {
    create: async(req, res) => {
        try {
            
            const party = {
                title: req.body.title,
                author: req.body.author,
                description: req.body.description,
                budget: req.body.budget,
                image: req.body.image,
                services: req.body.services,
            };

            // BUDGET < VALOR DOS SERVIÇOS
            if(party.services && !checkPartyBudget(party.budget, party.services)) {
                res.status(406).json({msg: "O seu orçamento é insuficiente."});
                return;
            }

            const response = await Party.create(party);

            res.status(201).json({ response, msg: "Festa criada com sucesso!" });

        } catch (error) {
            console.log(error);
        }
    },
    getAll: async(req, res) => {
        try {
            const parties = await Party.find();
            if(!parties) {
                res.status(404).json({ parties, mgs: "Festas não encontradas. Cadastre uma!" });
                return;
            }
            res.json(parties);
        } catch (error) {
            console.log(error);
        }
    },
    get: async(req, res) => {
        try {
            // id => URL === GET ( através dos parâmetros passados pela URL)
            const id = req.params.id;
            const party = await Party.findById(id);
            if(!party) {
                res.status(404).json({ mgs: "Festa não encontrada." });
                return;
            }
            res.json(party);
        } catch (error) {
            console.log(error);
        }
    },
    delete: async (req, res) => {
        try {
            const id = req.params.id;

            const party = await Party.findById(id);

            if(!party) {
                res.status(404).json({ mgs: "Festa não encontrada." });
                return;
            }

            const deletedParty = await Party.findByIdAndDelete(id);

            res.status(200).json({deletedParty, msg: "Festa excluída com sucesso."});
        } catch (error) {
            console.log(error);
        }
    },
    update: async (req, res) => {
        try {
            
            const id = req.params.id;

            const party = {
                title: req.body.title,
                author: req.body.author,
                description: req.body.description,
                budget: req.body.budget,
                image: req.body.image,
                services: req.body.services,
            };

            // BUDGET < VALOR DOS SERVIÇOS
            if(party.services && !checkPartyBudget(party.budget, party.services)) {
                res.status(406).json({msg: "O seu orçamento é insuficiente."});
                return;
            }
            
            const updatedParty = await Party.findByIdAndUpdate(id, party);

            if(!updatedParty) {
                res.status(404).json({ mgs: "Festa não encontrado." });
                return;
            }

            res.status(200).json({ updatedParty, msg: "Festa atualizado com sucesso!" });

        } catch (error) {
            console.log(error);
        }
    },
}

export default partyController;