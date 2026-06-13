const Facture=require('../models/Facture');
exports.getAll=async(req,res)=>{
  try{
    // Gerant : uniquement SES factures. Admin : toutes.
    const f=req.user.role==='admin'?{}:{gerantId:req.user.id};
    const list=await Facture.find(f).sort({createdAt:-1});
    res.json(list);
  }catch(e){res.status(500).json({message:e.message});}
};
exports.getOne=async(req,res)=>{
  try{
    const f=await Facture.findById(req.params.id).populate('commandeId').populate('clientId');
    if(!f)return res.status(404).json({message:'Facture introuvable.'});
    // Gerant : ne peut consulter qu'une facture qu'il a generee.
    if(req.user.role!=='admin' && String(f.gerantId)!==String(req.user.id))
      return res.status(403).json({message:'Acces refuse : cette facture ne vous appartient pas.'});
    res.json(f);
  }catch(e){res.status(500).json({message:e.message});}
};
exports.updateStatut=async(req,res)=>{
  try{
    const{statut}=req.body;
    if(!['payee','impayee'].includes(statut))
      return res.status(400).json({message:'Statut invalide. Valeurs : payee, impayee.'});
    const existing=await Facture.findById(req.params.id);
    if(!existing)return res.status(404).json({message:'Facture introuvable.'});
    // Gerant : ne peut modifier qu'une facture qu'il a generee.
    if(req.user.role!=='admin' && String(existing.gerantId)!==String(req.user.id))
      return res.status(403).json({message:'Acces refuse : cette facture ne vous appartient pas.'});
    existing.statut=statut;
    await existing.save();
    res.json(existing);
  }catch(e){res.status(500).json({message:e.message});}
};