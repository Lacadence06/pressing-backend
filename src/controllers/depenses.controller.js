const Depense=require('../models/Depense');
exports.getAll=async(_req,res)=>{
  try{
    const list=await Depense.find().sort({date:-1});
    res.json(list);
  }catch(e){res.status(500).json({message:e.message});}
};
exports.create=async(req,res)=>{
  try{
    const{nom,categorie,quantite,prix,date}=req.body;
    if(!nom||!quantite||!prix||!date)
      return res.status(400).json({message:'nom, quantite, prix et date sont requis.'});
    const q=parseInt(quantite,10)||1;
    const p=parseFloat(prix)||0;
    const dep=await Depense.create({
      nom:nom.trim(),categorie:categorie||'autre',
      quantite:q,prix:p,total:q*p,date,
      gerantId:req.user.id
    });
    res.status(201).json(dep);
  }catch(e){res.status(500).json({message:e.message});}
};
exports.update=async(req,res)=>{
  try{
    const{nom,categorie,quantite,prix,date}=req.body;
    const dep=await Depense.findById(req.params.id);
    if(!dep)return res.status(404).json({message:'Depense introuvable.'});
    if(nom!==undefined)dep.nom=nom.trim();
    if(categorie!==undefined)dep.categorie=categorie;
    if(quantite!==undefined)dep.quantite=parseInt(quantite,10)||dep.quantite;
    if(prix!==undefined)dep.prix=parseFloat(prix)||dep.prix;
    if(date!==undefined)dep.date=date;
    dep.total=dep.quantite*dep.prix;
    await dep.save();
    res.json(dep);
  }catch(e){res.status(500).json({message:e.message});}
};
exports.remove=async(req,res)=>{
  try{
    await Depense.findByIdAndDelete(req.params.id);
    res.json({message:'Depense supprimee.'});
  }catch(e){res.status(500).json({message:e.message});}
};