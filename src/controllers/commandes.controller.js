const Commande = require('../models/Commande');
const Facture  = require('../models/Facture');
const Client   = require('../models/Client');
const User     = require('../models/User');

async function nextNumero(Model,field,pre){
  const last=await Model.findOne({[field]:{$regex:'^'+pre}}).sort({[field]:-1});
  let n=1;if(last){const x=parseInt(last[field].replace(pre,''),10);if(!isNaN(x))n=x+1;}
  return pre+String(n).padStart(3,'0');
}
exports.getAll=async(req,res)=>{
  try{
    const f=req.user.role==='admin'?{}:{gerantId:req.user.id};
    const list=await Commande.find(f).sort({createdAt:-1});
    res.json(list);
  }catch(e){res.status(500).json({message:e.message});}
};
exports.getOne=async(req,res)=>{
  try{
    const c=await Commande.findById(req.params.id);
    if(!c)return res.status(404).json({message:'Commande introuvable.'});
    res.json(c);
  }catch(e){res.status(500).json({message:e.message});}
};
exports.create=async(req,res)=>{
  try{
    const{nomClient,telephoneClient,articles,notes}=req.body;
    if(!nomClient||!articles||!articles.length)
      return res.status(400).json({message:'nomClient et articles requis.'});
    const yr=new Date().getFullYear();
    let client=await Client.findOne({nom:{$regex:new RegExp('^'+nomClient.trim()+'$','i')}});
    if(!client)client=await Client.create({nom:nomClient.trim(),telephone:telephoneClient||undefined,gerantId:req.user.id});
    const total=articles.reduce((s,a)=>s+(a.quantite*a.prixUnitaire),0);
    const numCmd=await nextNumero(Commande,'numeroCommande','CMD-'+yr+'-');
    const today=new Date().toISOString().split('T')[0];
    const g=await User.findById(req.user.id).select('prenom nom');
    const gNom=g?g.prenom+' '+g.nom:req.user.email;
    const arts=articles.map(a=>({...a,sousTotal:a.quantite*a.prixUnitaire}));
    const commande=await Commande.create({
      numeroCommande:numCmd,nomClient:nomClient.trim(),
      telephoneClient:telephoneClient||undefined,clientId:client._id,
      articles:arts,total,statut:'en_attente',date:today,
      notes:notes||undefined,gerantId:req.user.id,gerantNom:gNom,
      createdBy:gNom,createdByRole:req.user.role,
      history:[{from:null,to:'en_attente',at:new Date().toISOString(),byUserId:req.user.id,byUserName:gNom,message:'Commande creee'}]
    });
    const numFac=await nextNumero(Facture,'numeroFacture','FAC-'+yr+'-');
    const facture=await Facture.create({
      numeroFacture:numFac,clientId:client._id,commandeId:commande._id,
      montant:total,statut:'impayee',dateCreation:today,
      gerantId:req.user.id,createdBy:gNom
    });
    res.status(201).json({commande,facture});
  }catch(e){res.status(500).json({message:e.message});}
};
exports.updateStatut=async(req,res)=>{
  try{
    const{statut,message}=req.body;
    const cmd=await Commande.findById(req.params.id);
    if(!cmd)return res.status(404).json({message:'Commande introuvable.'});
    const entry={from:cmd.statut,to:statut,at:new Date().toISOString(),
      byUserId:req.user.id,byUserName:req.user.email,
      message:message||('Passage a '+statut)};
    cmd.statut=statut;cmd.history.push(entry);
    await cmd.save();res.json(cmd);
  }catch(e){res.status(500).json({message:e.message});}
};
exports.remove=async(req,res)=>{
  try{
    await Commande.findByIdAndDelete(req.params.id);
    res.json({message:'Commande supprimee.'});
  }catch(e){res.status(500).json({message:e.message});}
};