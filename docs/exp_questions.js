import { EXPRESSION_TYPES } from "./exp_types.js";
export const QUESTIONS = [

// 1
//{ difficulty:"easy", domain:"electricite", law:"Loi d’Ohm", image:"./images/ohm.jpg", expr:"U=R*I", type:EXPRESSION_TYPES.PRODUCT, lhs:"U", factors:["R","I"], baseVars:["U","R","I"], targetPool:["R","I"], answers:{R:"U/I", I:"U/R"} },

// 2
//{ difficulty:"easy", domain:"chimie", law:"Masse volumique", image:"./images/masse_volumique.jpg", expr:"rho=m/V", type:EXPRESSION_TYPES.FRACTION, lhs:"rho", numerator:"m", denominator:"V", baseVars:["rho","m","V"], targetPool:["m","V"], answers:{m:"rho*V", V:"m/rho"} },

// 3
//{ difficulty:"easy", domain:"chimie", law:"Densité", image:"./images/densite.jpg", expr:"d=rho/rho0", type:EXPRESSION_TYPES.FRACTION, lhs:"d", numerator:"rho", denominator:"rho0", baseVars:["d","rho","rho0"], targetPool:["rho","rho0"], answers:{rho:"d*rho0", rho0:"rho/d"} },

// 4
//{ difficulty:"easy", domain:"chimie", law:"Concentration massique", image:"./images/concentration_massique.jpg", expr:"t=msolute/Vsolution", type:EXPRESSION_TYPES.FRACTION, lhs:"t", numerator:"msolute", denominator:"Vsolution", baseVars:["t","msolute","Vsolution"], targetPool:["msolute","Vsolution"], answers:{msolute:"t*Vsolution", Vsolution:"msolute/t"} },

// 5
//{ difficulty:"easy", domain:"chimie", law:"Concentration molaire", image:"./images/concentration_molaire.jpg", expr:"C=nsolute/Vsolution", type:EXPRESSION_TYPES.FRACTION, lhs:"C", numerator:"nsolute", denominator:"Vsolution", baseVars:["C","nsolute","Vsolution"], targetPool:["nsolute","Vsolution"], answers:{nsolute:"C*Vsolution", Vsolution:"nsolute/C"} },

// 6
//{ difficulty:"easy", domain:"chimie", law:"Quantité de matière", image:"./images/quantite_matiere.jpg", expr:"n=m/M", type:EXPRESSION_TYPES.FRACTION, lhs:"n", numerator:"m", denominator:"M", baseVars:["n","m","M"], targetPool:["m","M"], answers:{m:"n*M", M:"m/n"} },

// 7
//{ difficulty:"medium", domain:"chimie", law:"Dilution", image:"./images/dilution.jpg", expr:"C1*V1=C2*V2", type:EXPRESSION_TYPES.CROSS, left:["C1","V1"], right:["C2","V2"], baseVars:["C1","V1","C2","V2"], targetPool:["C1","V1","C2","V2"], answers:{C1:"C2*V2/V1", V1:"C2*V2/C1", C2:"C1*V1/V2", V2:"C1*V1/C2"} },

// 8
//{ difficulty:"easy", domain:"forces", law:"Poids", image:"./images/poids.jpg", expr:"P=m*g", type:EXPRESSION_TYPES.PRODUCT, lhs:"P", factors:["m","g"], baseVars:["P","m","g"], targetPool:["m","g"], answers:{m:"P/g", g:"P/m"} },

// 9
//{ difficulty:"medium", domain:"gravitation", law:"Force gravitationnelle", image:"./images/gravitation.jpg", expr:"F=G*m1*m2/r^2", type:EXPRESSION_TYPES.FORCE_CENTRALE, lhs:"F", numerator:["G","m1","m2"], denominator:"r", denominatorPower:2, baseVars:["F","G","m1","m2","r"], targetPool:["m1","m2","r"], answers:{m1:"F*r^2/G*m2", m2:"F*r^2/G*m1", r:"\sqrt(G*m1*m2/F)"} },

// 10
//{ difficulty:"hard", domain:"ondes", law:"Effet Doppler", image:"./images/doppler.jpg", expr:"f'=f*\\frac{v+v_r}{v+v_s}", type:EXPRESSION_TYPES.DOPPLER, lhs:"f'", numerator:["f","(v+vr)"], denominator:"(v+vs)", baseVars:["f'","f","v","vr","vs"], targetPool:["f", "v"], answers:{f:"f'*\\frac{v+vs}{v+vr}", v:"\\frac{f'*v_r-f*v_s}{f-f'}"} },

// 11
//{ difficulty:"medium", domain:"ondes", law:"Réfraction", image:"./images/refraction.jpg", expr:"n1*sin(i)=n2*sin(r)", type:EXPRESSION_TYPES.CROSS, left:["n1","sin(i)"], right:["n2","sin(r)"], baseVars:["n1","n2","sin(i)","sin(r)"], targetPool:["n1","n2","sin(i)","sin(r)"], answers:{n1: "n2*\\frac {sin(r)} {sin(i)}", n2:" n1*\\frac {sin(i)} {sin(r)}", "sin(i)":" n2*\\frac{sin(r)} {n1}" ,"sin(r)":" n1*\\frac {sin(i)} {n2}"} },

// 12
//{ difficulty:"easy", domain:"lentilles", law:"Grandissement", image:"./images/lens.jpg", expr:"G=A1B1/AB", type:EXPRESSION_TYPES.FRACTION, lhs:"G", numerator:"A1B1", denominator:"AB", baseVars:["G","A1B1","AB"], targetPool:["A1B1","AB"], answers:{A1B1:"G*AB", AB:"A1B1/G"} },

// 13
//{ difficulty:"easy", domain:"chimie", law:"Beer-Lambert", image:"./images/spectroscopie.jpg", expr:"A=epsilon*l*C", type:EXPRESSION_TYPES.PRODUCT_TRIPLE, lhs:"A", factors:["epsilon","l","C"], baseVars:["A","epsilon","l","C"], targetPool:["C"], answers:{C:"\\frac{A}{epsilon*l}"} },

// 14
//{ difficulty:"medium", domain:"chimie", law:"Titrage", image:"./images/titrage.jpg", expr:"\\frac{nA}{a}=\\frac{nB}{b}", type:EXPRESSION_TYPES.CROSS, left:["nA","b"], right:["nB","a"], baseVars:["nA","nB","a","b"], targetPool:["nA","nB"], answers:{nA:"\\frac{nB*a}{b}", nB:"\\frac{nA*b}{a}"} },

// 15
//{ difficulty:"hard", domain:"energie", law:"Variation d'énergie interne", image:"./images/chaleur.jpg", expr:"deltaU=m*c*(Tf-Ti)", type:EXPRESSION_TYPES.PRODUCT_THERMAL, lhs:"deltaU", factors:["m","c"], temp:["Tf","Ti"], baseVars:["deltaU","m","c","Tf","Ti"], targetPool:["m","Tf","Ti"], answers:{m: "\\frac{deltaU}{c*(Tf-Ti)}", Tf: "\\frac{deltaU}{m*c}+Ti", Ti: "Tf-{\\frac{deltaU}{m*c}}"} },

// 16
//{ difficulty:"medium", domain:"electricite", law:"Force de Coulomb", image:"./images/coulomb.jpg", expr:"F=k*q1*q2/r^2", type:EXPRESSION_TYPES.FORCE_CENTRALE, lhs:"F", numerator:["k","q1","q2"], denominator:"r", denominatorPower:2, baseVars:["F","k","q1","q2","r"], targetPool:["r","q1","q2"], answers:{q1:"F*r^2/k*q2", q2:"F*r^2/k*q1" , r:"\sqrt(k*q1*q2/F)"} },

// 17
//{ difficulty:"easy", domain:"fluide", law:"Hydrostatique", image:"./images/hydrostatique.jpg", expr:"P=rho*g*h", type:EXPRESSION_TYPES.PRODUCT_TRIPLE, lhs:"P", factors:["rho","g","h"], baseVars:["P","rho","g","h"], targetPool:["rho","h"], answers:{h: "\\frac{P}{rho*g}", rho: "\\frac{P}{g*h}"} },

// 18
//{ difficulty:"easy", domain:"thermodynamique", law:"Boyle-Mariotte", image:"./images/manometre.jpg", expr:"P*V=k", type:EXPRESSION_TYPES.PRODUCT, lhs:"k", factors:["P","V"], baseVars:["k","P","V"], targetPool:["P","V"], answers:{P:"k/V", V:"k/P"} },

// 19
//{ difficulty:"easy", domain:"energie", law:"Puissance", image:"./images/puissance.jpg", expr:"P=deltaE/deltat", type:EXPRESSION_TYPES.FRACTION, lhs:"P", numerator:"deltaE", denominator:"deltat", baseVars:["P","deltaE","deltat"], targetPool:["deltaE","deltat"], answers:{deltaE:"P*deltat", deltat:"deltat=deltaE/P"} },

// 20
//{ difficulty:"hard", domain:"electricite", law:"Effet Joule", image:"./images/joule.jpg", expr:"deltaE=R*I^2*deltat", type:EXPRESSION_TYPES.ENERGIE_JOULE, lhs:"deltaE", factors:["R","deltat"], poweredVar:"I", power:2, baseVars:["deltaE","R","I","deltat"], targetPool:["R","I","deltat"],coeff: "1", answers:{R:"\\frac{deltaE}{I^2*deltat}", I:"\\sqrt{\\frac{deltaE}{R*deltat}}", deltat:"\\frac{deltaE}{R*I^2}"} },

// 21
//{ difficulty:"medium", domain:"energie", law:"Énergie cinétique", image:"./images/energie_cinetique.jpg", expr:"Ec=\\frac{1}{2}*m*v^2", type:EXPRESSION_TYPES.ENERGIE_JOULE, lhs:"Ec", factors:["m","2"], poweredVar:"v", power:2, baseVars:["Ec","m","v"], targetPool:["m","v"],coeff: "1/2", answers:{m:"\\frac{2*Ec}{v^2}", v:"\\sqrt{\\frac{2*Ec}{m}}"} },

// 22
//{ difficulty:"medium", domain:"energie", law:"Énergie potentielle de pesanteur", image:"./images/energie_pot_pes.jpg", expr:"Epp(z)=m*g*z+Epp(0)", type:EXPRESSION_TYPES.ENERGIE_PESANTEUR, lhs:"Epp(z)", constant:"Epp(0)", factors:["m","g","z"], baseVars:["Epp(z)","m","g","z","Epp(0)"], targetPool:["m","z"], answers:{m:"\\frac{Epp(z)-Epp(0)}{g*z}", z:"\\frac{Epp(z)-Epp(0)}{m*g}"} },

// 23
//{ difficulty:"easy", domain:"ondes", law:"Célérité onde", image:"./images/celerite.jpg", expr:"v=lambda*f", type:EXPRESSION_TYPES.PRODUCT, lhs:"v", factors:["lambda","f"], baseVars:["v","lambda","f"], targetPool:["lambda","f"], answers:{lambda:"v/f", f:"v/lambda"} },

// 24
//{ difficulty:"easy", domain:"quantique", law:"Photon", image:"./images/energie_photon.jpg", expr:"E=h*nu", type:EXPRESSION_TYPES.PRODUCT, lhs:"E", factors:["h","nu"], baseVars:["E","h","nu"], targetPool:["nu"], answers:{nu:"E/h"} },

// 25
//{ difficulty:"hard", domain:"quantique", law:"Radioactivité", image:"./images/radio.jpg", expr:"N=N0*e^{(-lambda*t)}", type:EXPRESSION_TYPES.RADIOACTIVITE, lhs:"N", base:"N0", exponent:"(-lambda*t)", baseVars:["N","N0","lambda","t"], targetPool:["t","lambda"], answers:{t:"-\\frac{1}{lambda}*ln\\left(\\frac{N}{N0} \\right)", lambda:"-\\frac{1}{t}*ln\\left(\\frac{N}{N0} \\right)"} },

// 26
{ difficulty:"hard", domain:"chimie", law:"pH", image:"./images/acidite.jpg", expr: "pH=-log\\left(\\frac{H3O}{C0}\\right)", type:EXPRESSION_TYPES.LOG_PH, lhs:"pH", variable:"H3O", baseVars:["pH","H3O"], targetPool:["H3O"], answers:{"H3O": "C0*10^{-pH}"} },

// 27

//{ difficulty:"hard", domain:"gravitation", law:"Troisième loi de Kepler", image:"./images/kepler.jpg", expr:"\\frac{T^2}{R^3}=k", type:EXPRESSION_TYPES.POWER, lhs:"k", numerator:"T", numPower: 2, denominator:"R", denPower: 3, baseVars:["T","R","k"], targetPool:["R","T"], answers:{R:"\\sqrt[3]{\\frac{T^{2}}{k}}", T:"\\sqrt{k*R^{3}}"} },

// 28
//{ difficulty:"hard", domain:"fluide", law:"Loi de Bernoulli", image:"./images/bernoulli.jpg", expr:"P+ \\frac{1}{2}*rho*v^{2} +rho*g*z=k", type:EXPRESSION_TYPES.BERNOUILLI, lhs:"k", baseVars:["P","rho","g","z","v","k"], targetPool:["v","z"], answers:{v:"\\sqrt{{\\frac{2\\left(k-P-rho*g*z\\right)}{rho}}}",z: "\\frac{k-P-\\frac{1}{2}*rho*v^2}{rho*g}"} },

// 29
//{ difficulty:"easy", domain:"fluide", law:"Poussée Archimède", image:"./images/archimede.jpg", expr:"Pa=rho*V*g", type:EXPRESSION_TYPES.PRODUCT, lhs:"Pa", factors:["rho","V","g"], baseVars:["Pa","rho","V","g"], targetPool:["rho","V"], answers:{rho:"Pa/(V*g)", V:"Pa/(rho*g)"} },

// 30
//{ difficulty:"medium", domain:"fluide", law:"Effet Venturi", image:"./images/venturi.jpg", expr:"v1*S1=v2*S2", type:EXPRESSION_TYPES.CROSS, left:["v1","S1"], right:["v2","S2"], baseVars:["v1","v2","S1","S2"], targetPool:["v1","v2","S1","S2"], answers:{v1:"v2*\\frac{S2}{S1}", v2:"v1*\\frac{S1}{S2}", S1:"S2*\\frac{v2}{v1}", S2:"S1*\\frac{v1}{v2}"} },

// 31
//{ difficulty:"hard", domain:"thermodynamique", law:"Gaz parfait", image:"./images/gaz_parfait.jpg", expr:"P*V=n*R*T", type:EXPRESSION_TYPES.CROSS, left:["P","V"], right:["n","R*T"], baseVars:["P","V","n","R","T"], targetPool:["P","V","n","T"], answers:{P:"\\frac{n*R*T}{V}", V:"\\frac{n*R*T}{P}", n:"\\frac{P*V}{R*T}", T:"\\frac{P*V}{n*R}"} },

// 32
//{ difficulty:"hard", domain:"energie", law:" Stefan-Boltzmann", image:"./images/stefan.jpg", expr:"P=sigma*T^{4}", type:EXPRESSION_TYPES.POWER, lhs:"sigma", numerator:"P", numPower: 1, denominator: "T", denPower: 4, baseVars:["P","T","sigma"], targetPool:["T"], answers:{T: "\\sqrt[4]{\\frac{P}{sigma}}"} },

// 33
//{ difficulty:"easy", domain:"electricite", law:"Circuit RC", image:"./images/rc.jpg", expr:"tau=R*C", type:EXPRESSION_TYPES.PRODUCT, lhs:"tau", factors:["R","C"], baseVars:["tau","R","C"], targetPool:["R","C"], answers:{R:"tau/C", C:"tau/R"} },

// 34
//{ difficulty:"easy", domain:"ondes", law:"Diffraction", image:"./images/diffraction.jpg", expr:"theta=lambda/a", type:EXPRESSION_TYPES.FRACTION, lhs:"theta", numerator:"lambda", denominator:"a", baseVars:["theta","lambda","a"], targetPool:["lambda","a"], answers:{lambda:"theta*a", a:"lambda/theta"} },

// 35
//{ difficulty:"medium", domain:"ondes", law:"Interférences", image:"./images/interference.jpg", expr:"i=lambda*D/b", type:EXPRESSION_TYPES.PRODUCT_FRACTION, lhs:"i", left:["i","b"], right:["lambda","D"], baseVars:["i","lambda","D","b"], targetPool:["lambda","D","b"], answers:{lambda:"\\frac{i*b}{D}", D:"\\frac{i*b}{lambda}", b:"\\frac{lambda*D}{i}"} },

// 36
//{ difficulty:"hard", domain:"ondes", law:"Intensité sonore", image:"./images/son.jpg", expr:"L=10*log(I/I0)", type:EXPRESSION_TYPES.LOG_INTENSITE, lhs:"L", variable:"I", baseVars:["L","I","I0"], targetPool:["I"], answers:{I:"I0*10^{\\frac{L}{10}}"} },

// 37
//{ difficulty:"medium", domain:"mouvement", law:"Mouvement circulaire", image:"./images/acceleration_normale.jpg", expr:"a=\\frac{v{^2}}{R}", type:EXPRESSION_TYPES.POWER, lhs:"a", numerator:"v", numPower:2, denominator:"R",denPower: 1, baseVars:["v","R","a"], targetPool:["v","R"], answers:{v:"sqrt{a*R}", R:"\\frac{v^2}{a}"} },

// 38
//cd nextcloud/Travail/Training/docs//{ difficulty:"easy", domain:"electricite", law:"Charge électrique", image:"./images/quantite_elec.jpg", expr:"q=n*e", type:EXPRESSION_TYPES.PRODUCT, lhs:"q", factors:["n","e"], baseVars:["q","n","e"], targetPool:["n","e"], answers:{n:"q/e", e:"q/n"} },

// 39
//{ difficulty:"hard", domain:"lentilles", law:"Conjugaison", image:"./images/lens1.jpg", expr:"1/di-1/do=1/f", type:EXPRESSION_TYPES.RECIPROCAL_SUM, baseVars:["f","do","di"], targetPool:["f"], answers:{f:"(do*di)/(do-di)"} },

// 40
//{ difficulty:"easy", domain:"optique", law:"Lunette astronomique", image:"./images/lunette.jpg", expr:"G=fo/fe", type:EXPRESSION_TYPES.FRACTION, lhs:"G", numerator:"fo", denominator:"fe", baseVars:["G","fo","fe"], targetPool:["fo","fe"], answers:{fo:"G*fe", fe:"fo/G"} }

];
