const Facture=require('../models/Facture');
exports.getAll=async(req,res)=>{
  try{
    const list=await Facture.find().sort({createdAt:-1});
    res.json(list);
  }catch(e){res.status(500).json({message:e.message});}
};
exports.getOne=async(req,res)=>{
  try{
    const f=await Facture.findById(req.params.id).populate('commandeId').populate('clientId');
    if(!f)return res.status(404).json({message:'Facture introuvable.'});
    res.json(f);
  }catch(e){res.status(500).json({message:e.message});}
};
exports.updateStatut=async(req,res)=>{
  try{
    const{statut}=req.body;
    if(!['payee','impayee'].includes(statut))
      return res.status(400).json({message:'Statut invalide. Valeurs : payee, impayee.'});
    const f=await Facture.findByIdAndUpdate(req.params.id,{statut},{new:true});
    if(!f)return res.status(404).json({message:'Facture introuvable.'});
    res.json(f);
  }catch(e){res.status(500).json({message:e.message});}
};