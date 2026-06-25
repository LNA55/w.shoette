/* What works for me — outil de staging (web). Vanilla JS, local-first + sauvegarde serveur. */
(function () {
  'use strict';
  var API = './api.php';
  var pendingTag = '';

  /* ---------------- i18n ---------------- */
  var I18N = {
    fr: {
      tagline: 'Le journal de santé à qui tu parles',
      email: 'E-mail', password: 'Mot de passe',
      signin: 'Se connecter', signup: 'Créer un compte',
      noAccount: 'Pas encore de compte ?', haveAccount: 'Déjà un compte ?',
      doSignup: 'Inscris-toi', doSignin: 'Connecte-toi',
      errMissing: 'Renseigne ton e-mail et ton mot de passe.',
      errExists: 'Ce compte existe déjà — connecte-toi.',
      errNouser: 'Aucun compte avec cet e-mail.', errBadpass: 'Mot de passe incorrect.',
      navHome: 'Journal', navData: 'Données', navCorr: 'Corrélations', navSettings: 'Réglages',
      capturePh: 'Ex : Mal dormi, réveillée à 4h. Dîner fromage hier soir. Mains raides ce matin, temps humide…',
      add: 'Ajouter', listening: 'Écoute…', micOff: 'La dictée vocale arrivera dans l’app native.',
      saved: 'Entrée enregistrée ✓', photo: 'Photo',
      journalTitle: 'Ton journal', search: 'Rechercher', filters: 'Filtres',
      searchPh: 'Rechercher dans tes entrées…',
      fDates: 'Plage de dates', fTo: '→', fTag: 'Thème', fAll: 'Tous',
      fHours: 'Tranche horaire', apply: 'Appliquer', clear: 'Effacer',
      more: 'Afficher plus (24 h de plus)',
      emptyJournalT: 'Rien pour l’instant', emptyJournal: 'Note ta première journée dans l’encart ci-dessus.',
      noMatch: 'Aucune entrée ne correspond.',
      dataTitle: 'Tes données', dataSub: 'Tes entrées regroupées par thème — sans avoir rempli un seul formulaire.',
      emptyDataT: 'Pas encore de données', emptyData: 'Ajoute quelques entrées et reviens ici.',
      recapTitle: 'Récap', recapPeriod: '{n} derniers jours', viewValues: 'Valeurs santé', viewScore: 'Complétude du suivi',
      recapDaysLabel: 'Récap des données', recapDaysNote: 'Nombre de jours analysés (7 par défaut)',
      byTopic: 'Par thème',
      score1: 'Insuffisant', score2: 'Intermédiaire', score3: 'Suffisant',
      absent: 'informations absentes', climate: 'Climat',
      freq_daily: 'quotidien', freq_often: 'fréquent', freq_occasional: 'occasionnel',
      unitNight: 'h/nuit', unitMeals: 'prises/jour',
      corrTitle: 'Corrélations',
      corrSub: 'Ce que l’app commence à remarquer dans tes données. Attention, corrélation n’est pas causalité.',
      update: 'Mettre à jour', lastRun: 'Dernière analyse :', neverRun: 'Analyse jamais lancée',
      analysisDone: 'Analyse mise à jour ✓', insufficient: 'Informations entrées insuffisantes',
      patternTpl: 'Tes douleurs/symptômes reviennent souvent les jours où tu notes : « {x} ».',
      occText: '{n} occurrences sur {d} jours avec ce facteur',
      band_weak: 'association faible', band_moderate: 'association modérée', band_strong: 'association forte',
      insightCaveat: 'Association observée, pas une preuve de cause à effet.',
      corrWindowTitle: 'Fenêtre d’analyse',
      win_24h: '24 h', win_3d: '3 jours', win_1w: '1 semaine',
      winExpl_1: 'On regarde si un symptôme survient le jour même du facteur.',
      winExpl_3: 'On regarde si un symptôme survient dans les 3 jours qui suivent le facteur.',
      winExpl_7: 'On regarde si un symptôme survient dans la semaine qui suit le facteur.',
      spanPhrase_1: 'des 24 h précédentes', spanPhrase_3: 'des 3 jours précédents', spanPhrase_7: 'de la semaine précédente',
      observedTpl: 'Association observée le {date}, sur les données {span}.',
      pin: 'Épingler', unpin: 'Désépingler', hide: 'Masquer', unhide: 'Réafficher',
      pinnedTag: 'Épinglée', obsoleteTag: 'Obsolète', hiddenTag: 'Masquée',
      showObsolete: 'Afficher les corrélations obsolètes',
      noCurrentCorr: 'Aucune corrélation active pour cette fenêtre.',
      settingsTitle: 'Réglages',
      accTitle: 'Accessibilité', textSize: 'Taille du texte', tsNormal: 'Normal', tsLarge: 'Grand texte',
      language: 'Langue', theme: 'Thème', themeTurq: 'Turquoise', themeCoral: 'Corail',
      account: 'Compte', logout: 'Se déconnecter', pwUnknown: 'reconnecte-toi pour l’afficher',
      loadSample: 'Charger des exemples', exportData: 'Exporter mes données (JSON)',
      importData: 'Importer des données (JSON)', importDone: 'Données importées ✓', importErr: 'Fichier JSON invalide',
      importConfirm: 'Remplacer les données actuelles de ce compte par celles du fichier ?',
      backupNote: 'Tes données sont sauvegardées sur le serveur : elles survivent à la suppression de l’app et restent accessibles, même ton ordinateur éteint. Jamais envoyées sur GitHub.',
      legal: 'What works for me est un journal de santé et un outil d’exploration de corrélations. Il ne fournit pas de diagnostic et ne remplace pas l’avis d’un professionnel de santé. Les associations présentées sont statistiques, pas des preuves de cause à effet.',
      q_bad: 'plutôt difficile', q_ok: 'noté',
      cat_sleep: 'Sommeil', cat_food: 'Alimentation', cat_mood: 'Humeur', cat_energy: 'Énergie',
      cat_pain: 'Douleur', cat_stress: 'Stress', cat_symptom: 'Symptômes', cat_brain_fog: 'Brouillard mental',
      cat_meds: 'Médicaments', cat_activity: 'Activité', cat_measure: 'Mesures', cat_environment: 'Environnement', cat_other: 'Divers',
      quick1: '😴 Ma nuit', quick2: '🍽️ Mon repas', quick3: '🩹 Une douleur', quick4: '🙂 Mon humeur',
      qs1: 'Cette nuit, j’ai ', qs2: 'Au repas, j’ai mangé ', qs3: 'J’ai mal ', qs4: 'Mon humeur est ',
      editTitle: 'Modifier l’entrée', editSave: 'Enregistrer', editCancel: 'Annuler',
      editDelete: 'Supprimer l’entrée', editHint: 'Les nouvelles données seront prises en compte lors de la prochaine analyse.',
      editTagsTitle: 'Tags actifs', editAddTag: 'Ajouter un tag', editModified: 'modifiée', noTags: 'aucun tag',
      corrStale: 'Des entrées ont été modifiées depuis la dernière analyse. Cliquez sur « Mettre à jour » pour recalculer.'
    },
    en: {
      tagline: 'The health journal you talk to',
      email: 'Email', password: 'Password',
      signin: 'Sign in', signup: 'Create account',
      noAccount: 'No account yet?', haveAccount: 'Already have an account?',
      doSignup: 'Sign up', doSignin: 'Sign in',
      errMissing: 'Enter your email and password.',
      errExists: 'This account already exists — sign in.',
      errNouser: 'No account with this email.', errBadpass: 'Wrong password.',
      navHome: 'Journal', navData: 'Data', navCorr: 'Correlations', navSettings: 'Settings',
      capturePh: 'E.g. Slept badly, awake at 4am. Cheese for dinner. Stiff hands this morning, humid weather…',
      add: 'Add', listening: 'Listening…', micOff: 'Voice dictation is coming in the native app.',
      saved: 'Entry saved ✓', photo: 'Photo',
      journalTitle: 'Your journal', search: 'Search', filters: 'Filters',
      searchPh: 'Search your entries…',
      fDates: 'Date range', fTo: '→', fTag: 'Topic', fAll: 'All',
      fHours: 'Time of day', apply: 'Apply', clear: 'Clear',
      more: 'Show more (24 h earlier)',
      emptyJournalT: 'Nothing yet', emptyJournal: 'Log your first day in the box above.',
      noMatch: 'No entry matches.',
      dataTitle: 'Your data', dataSub: 'Your entries grouped by topic — without filling a single form.',
      emptyDataT: 'No data yet', emptyData: 'Add a few entries and come back here.',
      recapTitle: 'Recap', recapPeriod: 'last {n} days', viewValues: 'Health values', viewScore: 'Tracking completeness',
      recapDaysLabel: 'Data recap', recapDaysNote: 'Number of days analysed (7 by default)',
      byTopic: 'By topic',
      score1: 'Insufficient', score2: 'Partial', score3: 'Sufficient',
      absent: 'no data', climate: 'Climate',
      freq_daily: 'daily', freq_often: 'frequent', freq_occasional: 'occasional',
      unitNight: 'h/night', unitMeals: 'meals/day',
      corrTitle: 'Correlations',
      corrSub: 'What the app is starting to notice in your data. Remember: correlation is not causation.',
      update: 'Update', lastRun: 'Last analysis:', neverRun: 'Analysis not run yet',
      analysisDone: 'Analysis updated ✓', insufficient: 'Not enough information entered',
      patternTpl: 'Your pain/symptoms often come back on days when you log: “{x}”.',
      occText: '{n} occurrences over {d} days with this factor',
      band_weak: 'weak association', band_moderate: 'moderate association', band_strong: 'strong association',
      insightCaveat: 'Observed association — not proof of cause and effect.',
      corrWindowTitle: 'Analysis window',
      win_24h: '24 h', win_3d: '3 days', win_1w: '1 week',
      winExpl_1: 'We check whether a symptom occurs on the same day as the factor.',
      winExpl_3: 'We check whether a symptom occurs within 3 days after the factor.',
      winExpl_7: 'We check whether a symptom occurs within a week after the factor.',
      spanPhrase_1: 'previous 24 h', spanPhrase_3: 'previous 3 days', spanPhrase_7: 'previous week',
      observedTpl: 'Association observed on {date}, based on the {span}.',
      pin: 'Pin', unpin: 'Unpin', hide: 'Hide', unhide: 'Show again',
      pinnedTag: 'Pinned', obsoleteTag: 'Obsolete', hiddenTag: 'Hidden',
      showObsolete: 'Show obsolete correlations',
      noCurrentCorr: 'No active correlation for this window.',
      settingsTitle: 'Settings',
      accTitle: 'Accessibility', textSize: 'Text size', tsNormal: 'Normal', tsLarge: 'Large text',
      language: 'Language', theme: 'Theme', themeTurq: 'Turquoise', themeCoral: 'Coral',
      account: 'Account', logout: 'Sign out', pwUnknown: 'log in again to show it',
      loadSample: 'Load sample entries', exportData: 'Export my data (JSON)',
      importData: 'Import data (JSON)', importDone: 'Data imported ✓', importErr: 'Invalid JSON file',
      importConfirm: 'Replace the current data of this account with the file?',
      backupNote: 'Your data is saved on the server: it survives app deletion and stays accessible, even with your computer off. Never pushed to GitHub.',
      legal: 'What works for me is a health journal and a correlation-exploration tool. It does not provide a diagnosis and does not replace professional medical advice. The associations shown are statistical, not proof of cause and effect.',
      q_bad: 'rather rough', q_ok: 'logged',
      cat_sleep: 'Sleep', cat_food: 'Food', cat_mood: 'Mood', cat_energy: 'Energy',
      cat_pain: 'Pain', cat_stress: 'Stress', cat_symptom: 'Symptoms', cat_brain_fog: 'Brain fog',
      cat_meds: 'Medication', cat_activity: 'Activity', cat_measure: 'Measurements', cat_environment: 'Environment', cat_other: 'Other',
      quick1: '😴 My night', quick2: '🍽️ My meal', quick3: '🩹 Some pain', quick4: '🙂 My mood',
      qs1: 'Last night I ', qs2: 'For my meal I ate ', qs3: 'I have pain ', qs4: 'My mood is ',
      editTitle: 'Edit entry', editSave: 'Save', editCancel: 'Cancel',
      editDelete: 'Delete entry', editHint: 'New data will be picked up on the next analysis run.',
      editTagsTitle: 'Active tags', editAddTag: 'Add a tag', editModified: 'edited', noTags: 'no tags',
      corrStale: 'Some entries have been edited since the last analysis. Run "Update" to recalculate.'
    }
  };

  /* ---------------- Catégories & structuration ---------------- */
  var CAT_EMOJI = { sleep:'😴', food:'🍽️', mood:'🙂', energy:'⚡️', pain:'🩹', stress:'🌀',
    symptom:'🌡️', brain_fog:'🌫️', meds:'💊', activity:'🏃', measure:'📊', environment:'⛅️', other:'📝' };
  var CAT_ORDER = ['sleep','food','mood','energy','pain','stress','symptom','brain_fog','meds','activity','measure','environment','other'];
  var RECAP_KEYS = ['sleep','food','mood','energy','pain','stress','brain_fog','environment'];
  var CATS = [
    { key:'sleep', kw:['dormi','sommeil','nuit','réveil','réveillé','réveillée','insomnie','sieste','couché','endormi','slept','sleep','night','woke','awake','insomnia','nap','asleep'] },
    { key:'food', kw:['mangé','manger','repas','petit-déj','petit déjeuner','déjeuner','dîner','diner','café','thé','sucre','laitier','lait','fromage','gluten','snack','goûter','bu','ate','eat','meal','breakfast','lunch','dinner','coffee','tea','sugar','dairy','milk','cheese','snack','drank'] },
    { key:'mood', kw:['humeur','triste','heureux','heureuse','content','contente','anxieux','anxieuse','déprimé','déprimée','irritable','calme','nerveux','mood','sad','happy','content','anxious','depressed','irritable','calm','nervous'] },
    { key:'energy', kw:['énergie','fatigué','fatiguée','fatigue','épuisé','épuisée','crevé','crevée','en forme','vitalité','energy','tired','fatigue','exhausted','drained','energetic'] },
    { key:'brain_fog', kw:['brouillard mental','tête dans le brouillard','difficultés de concentration','concentration difficile','confusion mentale','flou mental','tête cotonneuse','confuse mentalement','confus mentalement','brain fog','foggy brain','foggy mind','mental fog','cognitive fog','foggy','forgetful','brain is foggy'] },
    { key:'pain', kw:['mal','douleur','douleurs','migraine','céphalée','tête','ventre','dos','articulation','articulations','raideur','raides','courbature','pain','ache','sore','migraine','headache','stomach','back','joint','joints','stiff','stiffness'] },
    { key:'stress', kw:['stress','stressé','stressée','tendu','tendue','pression','débordé','débordée','stress','stressed','tense','pressure','overwhelmed'] },
    { key:'symptom', kw:['nausée','nausées','fièvre','toux','éruption','bouton','ballonnement','ballonné','vertige','diarrhée','constipation','rhume','nausea','fever','cough','rash','bloated','bloating','dizzy','dizziness','diarrhea','constipation','cold'] },
    { key:'meds', kw:['médicament','médicaments','cachet','comprimé','ibuprofène','doliprane','paracétamol','antibiotique','pilule','vitamine','vitamines','medication','pill','tablet','ibuprofen','tylenol','paracetamol','antibiotic','vitamin'] },
    { key:'activity', kw:['marché','marche','sport','couru','course','yoga','gym','vélo','natation','musculation','walked','sport','ran','run','running','yoga','gym','bike','swim','workout','steps'] },
    { key:'measure', kw:['tension','glycémie','poids','température','pouls','blood pressure','glucose','weight','temperature','pulse','heart rate'] },
    { key:'environment', kw:['pluie','pluvieux','pluvieuse','humide','humidité','chaud','froid','frais','orage','soleil','météo','vent','rain','rainy','humid','humidity','hot','cold','cool','storm','sun','weather','wind'] }
  ];
  function cap(s){ return s ? s.charAt(0).toUpperCase()+s.slice(1) : s; }
  function snippet(s){ s=s.trim().replace(/\s+/g,' '); return s.length>46 ? s.slice(0,46)+'…' : s; }
  function extractValue(key, lc){
    var m;
    if (key==='sleep'){ m=lc.match(/(\d{1,2})(?:[.,](\d))?\s*(h\b|heures?|hours?|hrs?)/); if(m) return m[1]+(m[2]?','+m[2]:'')+' h'; }
    if (key==='measure'){
      if (m=lc.match(/(\d{2,3})\s*\/\s*(\d{2,3})/)) return m[1]+'/'+m[2]+' mmHg';
      if (m=lc.match(/(\d+(?:[.,]\d+)?)\s*(mg\/dl|g\/l)/)) return m[1]+' '+m[2];
      if (m=lc.match(/(\d{2,3}(?:[.,]\d)?)\s*kg/)) return m[1]+' kg';
      if (m=lc.match(/(\d{2,3})\s*bpm/)) return m[1]+' bpm';
    }
    return null;
  }
  function structureEntry(text){
    var raw=(text||'').trim(); if(!raw) return [];
    var lc=' '+raw.toLowerCase().replace(/\s+/g,' ')+' ';
    var neg=/\b(pas|mal|peu|mauvais|mauvaise|sans|aucun|aucune|not|no|bad|poorly|hardly|barely)\b/.test(lc);
    var found=[], seen={};
    CATS.forEach(function(c){
      if (seen[c.key]) return;
      var hit=null;
      for (var i=0;i<c.kw.length;i++){ var k=c.kw[i]; if (lc.indexOf(' '+k)>-1 || lc.indexOf(k+' ')>-1){ hit=k; break; } }
      if (!hit) return;
      seen[c.key]=true;
      var value=extractValue(c.key, lc);
      if (!value && (c.key==='sleep'||c.key==='mood'||c.key==='energy')) value = neg ? t('q_bad') : t('q_ok');
      found.push({ category:c.key, label: value || cap(hit), value: value||null, confidence:0.74 });
    });
    if (!found.length) found.push({ category:'other', label:snippet(raw), value:null, confidence:0.5 });
    return found;
  }

  /* ---------------- État ---------------- */
  var S = { lang:'fr', theme:'turquoise', textsize:'normal', token:null, email:null,
            store:{ profile:{}, entries:[], insights:[], lastAnalysisAt:null },
            tab:'home', rec:null, recOn:false, draft:'', draftPhoto:null, dataView:'values',
            searchOpen:false, filterOpen:false, windowHours:24,
            filters:{ q:'', dateFrom:'', dateTo:'', tag:'', hourStart:0, hourEnd:24 },
            editingId:null, editDraft:'', editSigs:[], editSigsDirty:false };

  function t(k){ var d=I18N[S.lang]||I18N.fr; return (k in d)?d[k]:(I18N.fr[k]!==undefined?I18N.fr[k]:k); }
  function catName(key){ return t('cat_'+key); }
  function esc(s){ return (s==null?'':String(s)).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
  function fmtDate(ts){ var d=new Date(ts), loc=S.lang==='fr'?'fr-FR':'en-US';
    return d.toLocaleDateString(loc,{weekday:'short',day:'numeric',month:'short'})+' · '+d.toLocaleTimeString(loc,{hour:'2-digit',minute:'2-digit'}); }
  function fmtDay(ts){ var d=new Date(ts), loc=S.lang==='fr'?'fr-FR':'en-US';
    return d.toLocaleDateString(loc,{day:'numeric',month:'long'}); }

  /* ---------------- Stockage ---------------- */
  var LS_SESSION='wwfm_session', LS_USERS='wwfm_users';
  function lsStoreKey(id){ return 'wwfm_store_'+id; }
  function lsGet(k,def){ try{ var v=localStorage.getItem(k); return v?JSON.parse(v):def; }catch(e){ return def; } }
  function lsSet(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
  function normStore(s){ s=s||{}; s.profile=s.profile||{}; s.entries=s.entries||[]; s.insights=s.insights||[]; if(!('lastAnalysisAt' in s)) s.lastAnalysisAt=null; s.correlations=s.correlations||{}; if(!('corrWindow' in s)) s.corrWindow=3; if(!('recapDays' in s)) s.recapDays=7; return s; }
  function api(action, payload){
    payload=payload||{}; payload.action=action;
    return fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
      .then(function(r){ return r.json(); }).catch(function(){ return {ok:false,error:'network'}; });
  }
  function setSession(token,email){ S.token=token; S.email=email;
    lsSet(LS_SESSION,{token:token,email:email,lang:S.lang,theme:S.theme,textsize:S.textsize}); }
  function persistStore(){ if(S.token){ lsSet(lsStoreKey(S.token), S.store); api('save',{token:S.token,store:S.store}); } }
  function localSignup(email,pass){ var users=lsGet(LS_USERS,{}); if(users[email]) return {ok:false,error:'exists'};
    var id='loc_'+Math.random().toString(36).slice(2,10); users[email]={id:id,pass:pass}; lsSet(LS_USERS,users);
    var store=normStore({profile:{lang:S.lang,theme:S.theme}}); lsSet(lsStoreKey(id),store);
    return {ok:true,token:id,email:email,store:store}; }
  function localLogin(email,pass){ var users=lsGet(LS_USERS,{}); var u=users[email];
    if(!u) return {ok:false,error:'nouser'}; if(u.pass!==pass) return {ok:false,error:'badpass'};
    return {ok:true,token:u.id,email:email,store:normStore(lsGet(lsStoreKey(u.id),{}))}; }
  function doAuth(mode,email,pass,onErr){
    email=(email||'').trim().toLowerCase(); if(!email||!pass){ onErr(t('errMissing')); return; }
    api(mode,{email:email,password:pass,lang:S.lang,theme:S.theme}).then(function(res){
      if(res.error==='network'){ res = (mode==='signup'?localSignup:localLogin)(email,pass); }
      if(!res.ok){ onErr(t('err'+cap(res.error||'Missing'))); return; }
      finishAuth(res, pass);
    });
  }
  function applyProfile(){ var p=S.store.profile||{}; if(p.lang)S.lang=p.lang; if(p.theme)S.theme=p.theme; if(p.textsize)S.textsize=p.textsize; }
  function finishAuth(res, pass){ setSession(res.token,res.email); S.store=normStore(res.store); applyProfile();
    if(pass){ S.store.profile.password=pass; }
    lsSet(lsStoreKey(res.token),S.store); applyTheme(); applyTextsize(); S.tab='home'; if(pass){ persistStore(); } render(); }
  function logout(){ localStorage.removeItem(LS_SESSION); S.token=null; S.email=null; S.store=normStore({}); render(); }
  function loadStoreFromServer(){ if(!S.token) return;
    api('load',{token:S.token}).then(function(res){ if(res.ok && res.store){ S.store=normStore(res.store); lsSet(lsStoreKey(S.token),S.store);
      applyProfile(); applyTheme(); applyTextsize(); render(); } }); }

  /* ---------------- Thème / langue / accessibilité ---------------- */
  function applyTheme(){ document.body.setAttribute('data-theme',S.theme);
    var meta=document.getElementById('themeColorMeta'); if(meta) meta.setAttribute('content', S.theme==='coral' ? '#F1514F' : '#118996'); }
  function applyTextsize(){ document.documentElement.setAttribute('data-textsize', S.textsize==='large'?'large':'normal'); }
  function prof(){ S.store.profile=S.store.profile||{}; return S.store.profile; }
  function setTheme(v){ S.theme=v; prof().theme=v; applyTheme(); persistStore(); render(); }
  function setLang(v){ S.lang=v; prof().lang=v; document.documentElement.lang=v; persistStore(); render(); }
  function setTextsize(v){ S.textsize=v; prof().textsize=v; applyTextsize(); persistStore(); render(); }

  /* ---------------- Entrées / photo ---------------- */
  function addEntry(text, photo){ text=(text||'').trim(); if(!text && !photo) return;
    S.store.entries.unshift({ id:'e_'+Date.now().toString(36), createdAt:Date.now(), text:text, photo:photo||null, signals:structureEntry(text) });
    S.draft=''; S.draftPhoto=null; persistStore(); toast(t('saved')); render(); }
  function handlePhoto(file){
    if(!file) return; var reader=new FileReader();
    reader.onload=function(ev){ var img=new Image();
      img.onload=function(){ var max=1000,w=img.width,h=img.height;
        if(w>max||h>max){ if(w>h){ h=Math.round(h*max/w); w=max; } else { w=Math.round(w*max/h); h=max; } }
        var cv=document.createElement('canvas'); cv.width=w; cv.height=h; cv.getContext('2d').drawImage(img,0,0,w,h);
        try{ S.draftPhoto=cv.toDataURL('image/jpeg',0.7); }catch(e){ S.draftPhoto=ev.target.result; } render(); };
      img.src=ev.target.result; };
    reader.readAsDataURL(file);
  }

  function sortedEntries(){ return S.store.entries.slice().sort(function(a,b){return b.createdAt-a.createdAt;}); }
  function filtersActive(){ var f=S.filters; return !!(f.q||f.dateFrom||f.dateTo||f.tag||f.hourStart>0||f.hourEnd<24); }
  function matchEntry(e){
    var f=S.filters;
    if(f.q){ var hay=((e.text||'')+' '+(e.signals||[]).map(function(s){return s.category+' '+(s.value||s.label);}).join(' ')).toLowerCase();
      if(hay.indexOf(f.q.toLowerCase())<0) return false; }
    if(f.tag){ if(!(e.signals||[]).some(function(s){return s.category===f.tag;})) return false; }
    if(f.dateFrom){ var df=Date.parse(f.dateFrom+'T00:00:00'); if(!isNaN(df) && e.createdAt<df) return false; }
    if(f.dateTo){ var dt=Date.parse(f.dateTo+'T23:59:59'); if(!isNaN(dt) && e.createdAt>dt) return false; }
    var d=new Date(e.createdAt), hr=d.getHours()+d.getMinutes()/60;
    if(hr<f.hourStart || hr>f.hourEnd) return false;
    return true;
  }

  /* ---------------- Analyse de corrélations (manuelle) ---------------- */
  /* Fenêtre glissante paramétrable (windowDays) : un trigger J0 co-occure si un
     symptôme apparaît entre J0 et J0+(windowDays-1). 1 = 24 h, 3 = 3 jours, 7 = 1 semaine. */
  function computeInsights(windowDays){
    var DAY=864e5, W=windowDays||3;
    var since=Date.now()-14*DAY, recent=S.store.entries.filter(function(e){return e.createdAt>=since;});
    var dayMap={};
    recent.forEach(function(e){
      var d=new Date(e.createdAt);
      var ts=new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime();
      dayMap[ts]=dayMap[ts]||{flag:false,trig:{}};
      (e.signals||[]).forEach(function(s){
        if(s.category==='pain'||s.category==='symptom'||s.category==='brain_fog') dayMap[ts].flag=true;
        if(s.category==='food'||s.category==='environment'){ dayMap[ts].trig[(s.value||s.label).toLowerCase()]=(s.value||s.label); }
      });
    });
    var flagDays={};
    Object.keys(dayMap).forEach(function(ts){ if(dayMap[ts].flag) flagDays[+ts]=true; });
    var triggerDays={}, coOccur={};
    Object.keys(dayMap).forEach(function(ts){
      var tsN=+ts, d=dayMap[ts];
      Object.keys(d.trig).forEach(function(low){
        triggerDays[low]=triggerDays[low]||{n:0,label:d.trig[low]};
        triggerDays[low].n++;
        var hit=false; for(var k=0;k<W;k++){ if(flagDays[tsN+k*DAY]){ hit=true; break; } }
        if(hit){ coOccur[low]=(coOccur[low]||0)+1; }
      });
    });
    return Object.keys(coOccur).filter(function(low){return coOccur[low]>=2;}).map(function(low){
      var n=coOccur[low], td=triggerDays[low].n, band=n>=6?'strong':(n>=4?'moderate':'weak');
      return {key:low, label:triggerDays[low].label, incidents:n, days:td, band:band, ratio:td?n/td:0};
    }).sort(function(a,b){return b.incidents-a.incidents;}).slice(0,6);
  }
  /* Fusionne les résultats frais dans le dictionnaire persistant : conserve pin/hidden,
     marque obsolètes (current=false) les corrélations absentes du dernier run. */
  function runAnalysis(){
    var W=S.store.corrWindow||3, fresh=computeInsights(W), now=Date.now();
    var dict=S.store.correlations||{}, freshKeys={};
    fresh.forEach(function(p){ freshKeys[p.key]=true; var prev=dict[p.key]||{};
      dict[p.key]={ key:p.key, label:p.label, incidents:p.incidents, days:p.days, band:p.band, ratio:p.ratio,
        observedAt:now, windowDays:W, current:true, pinned:!!prev.pinned, hidden:!!prev.hidden }; });
    Object.keys(dict).forEach(function(k){ if(!freshKeys[k]) dict[k].current=false; });
    S.store.correlations=dict; S.store.lastAnalysisAt=now; persistStore(); render(); toast(t('analysisDone'));
  }

  /* ---------------- Récap (Données) ---------------- */
  function freqLabel(d,win){ var w=win||7; return d>=Math.ceil(w*0.8)?t('freq_daily'):(d>=Math.ceil(w*0.4)?t('freq_often'):t('freq_occasional')); }
  function computeRecap(){
    var win=S.store.recapDays||7;
    var since=Date.now()-win*864e5, recent=S.store.entries.filter(function(e){return e.createdAt>=since;});
    var by={}; RECAP_KEYS.forEach(function(k){ by[k]={days:{},count:0,vals:[]}; });
    recent.forEach(function(e){ var dk=new Date(e.createdAt); dk=dk.getFullYear()+'-'+dk.getMonth()+'-'+dk.getDate();
      (e.signals||[]).forEach(function(s){ if(by[s.category]){ by[s.category].days[dk]=1; by[s.category].count++; by[s.category].vals.push(s.value||s.label); } }); });
    var s3=Math.ceil(win*0.7), s2=Math.ceil(win*0.35);
    return RECAP_KEYS.map(function(k){ var c=by[k], d=Object.keys(c.days).length;
      return { key:k, label:(k==='environment'?t('climate'):catName(k)), days:d, score:(d>=s3?3:(d>=s2?2:1)), value:recapValue(k,c,d,win), absent:(d===0) }; });
  }
  function recapValue(key,c,d,win){
    if(d===0) return t('absent');
    if(key==='sleep'){ var nums=c.vals.map(function(v){ var m=String(v).replace(',','.').match(/([\d.]+)\s*h/); return m?parseFloat(m[1]):null; }).filter(function(x){return x!=null;});
      if(nums.length){ var a=nums.reduce(function(x,y){return x+y;},0)/nums.length; return (Math.round(a*10)/10)+' '+t('unitNight'); } return freqLabel(d,win); }
    if(key==='food'){ return Math.max(1,Math.round(c.count/d))+' '+t('unitMeals'); }
    if(key==='environment'){ var f={},best='',bn=0; c.vals.forEach(function(v){ var x=String(v).toLowerCase(); f[x]=(f[x]||0)+1; if(f[x]>bn){bn=f[x];best=x;} }); return best?cap(best):t('absent'); }
    return freqLabel(d,win);
  }

  /* ---------------- UI helpers ---------------- */
  function toast(msg){ var el=document.getElementById('toast'); if(!el)return; el.textContent=msg; el.hidden=false;
    clearTimeout(toast._t); toast._t=setTimeout(function(){el.hidden=true;},1900); }
  function navIcon(name){
    var p={ home:'<path d="M8 6h12M8 12h12M8 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
      data:'<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
      corr:'<path d="M5 20v-6M12 20V5M19 20v-9"/><path d="M3 20h18"/>',
      settings:'<circle cx="12" cy="12" r="3.2"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8"/>',
      search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
      filter:'<path d="M4 5h16M7 12h10M10 19h4"/>',
      camera:'<path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1.2-2h6.6L16.5 7h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5z"/><circle cx="12" cy="13" r="3.2"/>' };
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+(p[name]||'')+'</svg>';
  }
  function chip(s){ return '<span class="chip"><span class="em">'+CAT_EMOJI[s.category]+'</span>'+esc(catName(s.category))+(s.value?' · '+esc(s.value):'')+'</span>'; }
  function entryCard(e){
    var editBtn='<button class="iconbtn xs edit-btn" data-act="edit-open" data-v="'+esc(e.id)+'" aria-label="'+esc(t('editTitle'))+'">'+
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/></svg></button>';
    return '<div class="card entry">'+
      '<div class="entry-head"><div class="when">'+esc(fmtDate(e.createdAt))+'</div>'+
      (e.editedAt?'<span class="edited-badge">'+esc(t('editModified'))+'</span>':'')+editBtn+'</div>'+
      (e.text?'<div class="txt">'+esc(e.text)+'</div>':'')+
      (e.photo?'<img class="photo" src="'+esc(e.photo)+'" alt="">':'')+
      ((e.signals&&e.signals.length)?'<div class="chips">'+e.signals.map(chip).join('')+'</div>':'')+
    '</div>';
  }
  function editModalHtml(){
    var entry=S.store.entries.find(function(e){return e.id===S.editingId;}); if(!entry) return '';
    var usedCats=S.editSigs.map(function(s){return s.category;});
    var tagsHtml=S.editSigs.length ? S.editSigs.map(function(sig,idx){
      return '<span class="chip edit-chip"><span class="em">'+(CAT_EMOJI[sig.category]||'')+'</span>'+esc(catName(sig.category))+(sig.value?' · '+esc(sig.value):'')+
        '<button class="rm-tag" data-act="edit-rm-tag" data-v="'+idx+'">×</button></span>';
    }).join('') : '<span class="hint-sm">'+esc(t('noTags'))+'</span>';
    var addable=CAT_ORDER.filter(function(k){return usedCats.indexOf(k)<0;});
    var addHtml=addable.map(function(k){
      return '<button class="tagchip" data-act="edit-add-tag" data-v="'+k+'">'+(CAT_EMOJI[k]||'')+' '+esc(catName(k))+'</button>';
    }).join('');
    return '<div class="edit-overlay">'+
      '<div class="edit-backdrop" data-act="edit-cancel"></div>'+
      '<div class="edit-sheet card">'+
        '<h3 class="edit-title">'+esc(t('editTitle'))+'</h3>'+
        '<textarea id="editInput" class="field edit-ta">'+esc(S.editDraft)+'</textarea>'+
        '<div class="edit-section-lbl">'+esc(t('editTagsTitle'))+'</div>'+
        '<div class="edit-tags">'+tagsHtml+'</div>'+
        (addable.length?'<div class="edit-section-lbl">'+esc(t('editAddTag'))+'</div><div class="edit-add-tags tagchips">'+addHtml+'</div>':'')+
        '<div class="edit-btns">'+
          '<button class="btn btn-danger" data-act="edit-delete">'+esc(t('editDelete'))+'</button>'+
          '<span style="flex:1"></span>'+
          '<button class="btn btn-ghost" data-act="edit-cancel">'+esc(t('editCancel'))+'</button>'+
          '<button class="btn" data-act="edit-save">'+esc(t('editSave'))+'</button>'+
        '</div>'+
        '<p class="edit-hint">'+esc(t('editHint'))+'</p>'+
      '</div>'+
    '</div>';
  }
  function empty(tk,bk,big){ return '<div class="empty"><div class="big">'+big+'</div><h3>'+esc(t(tk))+'</h3><p>'+esc(t(bk))+'</p></div>'; }
  function pinSvg(filled){ return '<svg viewBox="0 0 24 24" fill="'+(filled?'currentColor':'none')+'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4h6l-1 6 3 3v2h-4.5"/><path d="M12.5 15H6v-2l3-3"/><path d="M12 20v-5"/></svg>'; }
  function insightCard(c){
    var spanPhrase = c.windowDays===1?t('spanPhrase_1'):(c.windowDays===7?t('spanPhrase_7'):t('spanPhrase_3'));
    var dateLine = t('observedTpl').replace('{date}', fmtDay(c.observedAt||Date.now())).replace('{span}', spanPhrase);
    var obsolete = !c.current && !c.pinned;
    var tags = '';
    if(c.pinned) tags += '<span class="corr-tag tag-pinned">'+esc(t('pinnedTag'))+'</span>';
    if(obsolete) tags += '<span class="corr-tag tag-obsolete">'+esc(t('obsoleteTag'))+'</span>';
    if(c.hidden) tags += '<span class="corr-tag tag-hidden">'+esc(t('hiddenTag'))+'</span>';
    var actions = '<button class="corr-act'+(c.pinned?' is-on':'')+'" data-act="corr-pin" data-v="'+esc(c.key)+'">'+pinSvg(c.pinned)+'<span>'+esc(c.pinned?t('unpin'):t('pin'))+'</span></button>'+
      (c.hidden
        ? '<button class="corr-act" data-act="corr-unhide" data-v="'+esc(c.key)+'"><span>'+esc(t('unhide'))+'</span></button>'
        : '<button class="corr-act" data-act="corr-hide" data-v="'+esc(c.key)+'"><span>'+esc(t('hide'))+'</span></button>');
    return '<div class="card insight'+(c.pinned?' is-pinned':'')+(obsolete||c.hidden?' is-archived':'')+'">'+
      (tags?'<div class="corr-tags">'+tags+'</div>':'')+
      '<div class="stmt">'+esc(t('patternTpl').replace('{x}',c.label))+'</div>'+
      '<div class="meta"><span class="band band-'+c.band+'">'+esc(t('band_'+c.band))+'</span><span class="bar"><i style="width:'+Math.round(c.ratio*100)+'%"></i></span></div>'+
      '<div class="occ">'+esc(t('occText').replace('{n}',c.incidents).replace('{d}',c.days))+'</div>'+
      '<div class="corr-date">'+esc(dateLine)+'</div>'+
      '<div class="corr-actions">'+actions+'</div>'+
    '</div>'; }

  /* ---------------- Rendu ---------------- */
  function render(){
    document.documentElement.lang=S.lang;
    if(!S.token){ renderAuth(); return; }
    document.getElementById('app').innerHTML =
      '<header class="topbar"><div class="wrap">'+
        '<div class="brand"><span class="dot"></span>What works for me</div>'+
        '<div class="brand"><small>'+esc((S.email||'').split('@')[0])+'</small></div>'+
      '</div></header>'+
      '<main class="screen"><div class="wrap">'+ screenHtml() +'</div></main>'+ tabbarHtml()+
      (S.editingId ? editModalHtml() : '');
    if(S.searchOpen){ var si=document.getElementById('homeSearch'); if(si){ si.focus(); var l=si.value.length; try{si.setSelectionRange(l,l);}catch(e){} } }
    if(S.editingId){ var ei=document.getElementById('editInput'); if(ei){ ei.focus(); var el=ei.value.length; try{ei.setSelectionRange(el,el);}catch(e){} } }
  }
  render._authMode='signup';
  function renderAuth(){
    var m=render._authMode;
    document.getElementById('app').innerHTML =
      '<div class="auth">'+
        '<div class="logo">'+navIcon('corr')+'</div>'+
        '<h1>What works for me</h1><p class="tag">'+esc(t('tagline'))+'</p>'+
        '<div class="card stack">'+
          '<div><label class="lbl">'+esc(t('email'))+'</label><input id="f_email" class="field" type="email" autocomplete="email" inputmode="email" placeholder="toi@exemple.com"></div>'+
          '<div><label class="lbl">'+esc(t('password'))+'</label><input id="f_pass" class="field" type="password" autocomplete="'+(m==='signup'?'new-password':'current-password')+'" placeholder="••••••••"></div>'+
          '<button class="btn btn-block" data-act="auth">'+esc(m==='signup'?t('signup'):t('signin'))+'</button>'+
          '<div class="err" id="authErr"></div>'+
        '</div>'+
        '<p class="switch">'+esc(m==='signup'?t('haveAccount'):t('noAccount'))+' <a href="#" data-act="toggleAuth">'+esc(m==='signup'?t('doSignin'):t('doSignup'))+'</a></p>'+
        '<p class="note" style="text-align:center">'+esc(t('legal'))+'</p>'+
      '</div>';
  }
  function screenHtml(){ switch(S.tab){ case 'data': return dataHtml(); case 'corr': return corrHtml(); case 'settings': return settingsHtml(); default: return homeHtml(); } }

  function captureBox(){
    var mic = (window.SpeechRecognition||window.webkitSpeechRecognition)
      ? '<button class="iconbtn" data-act="mic" aria-label="micro"'+(S.recOn?' style="background:var(--c-500);color:#fff;border-color:var(--c-500)"':'')+'><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg></button>' : '';
    var preview = S.draftPhoto ? '<div class="photo-prev"><img src="'+esc(S.draftPhoto)+'" alt=""><button class="ph-x" data-act="rm-photo" aria-label="retirer">×</button></div>' : '';
    return '<div class="capture"><div class="box">'+
        '<textarea id="capInput" placeholder="'+esc(t('capturePh'))+'">'+esc(S.draft)+'</textarea>'+ preview +
        '<div class="row">'+ mic +
          '<button class="iconbtn" data-act="photo" aria-label="'+esc(t('photo'))+'">'+navIcon('camera')+'</button>'+
          '<input type="file" id="photoInput" accept="image/*" capture="environment" style="display:none">'+
          '<span class="spacer"></span><button class="btn" data-act="add">'+esc(t('add'))+'</button></div>'+
      '</div>'+
      '<div class="quick">'+ ['quick1|qs1','quick2|qs2','quick3|qs3','quick4|qs4'].map(function(p){var a=p.split('|');
          return '<button data-act="quick" data-v="'+a[1]+'">'+esc(t(a[0]))+'</button>';}).join('') +'</div>'+
      (S.recOn?'<p class="hint">'+esc(t('listening'))+'</p>':'')+'</div>';
  }
  function filterPanelHtml(){
    var f=S.filters;
    var chips='<button class="tagchip'+(pendingTag===''?' on':'')+'" data-act="tag" data-v="">'+esc(t('fAll'))+'</button>'+
      CAT_ORDER.map(function(k){ return '<button class="tagchip'+(pendingTag===k?' on':'')+'" data-act="tag" data-v="'+k+'">'+CAT_EMOJI[k]+' '+esc(catName(k))+'</button>'; }).join('');
    var hs=f.hourStart||0, he=(f.hourEnd===0?24:(f.hourEnd||24));
    return '<div class="filters card">'+
      '<div class="frow"><span class="flbl">'+esc(t('fDates'))+'</span>'+
        '<input type="date" id="fFrom" class="field sm" value="'+esc(f.dateFrom)+'"><span class="arrow">'+esc(t('fTo'))+'</span>'+
        '<input type="date" id="fTo" class="field sm" value="'+esc(f.dateTo)+'"></div>'+
      '<div class="frow col"><span class="flbl">'+esc(t('fTag'))+'</span><div class="tagchips">'+chips+'</div></div>'+
      '<div class="frow col"><span class="flbl">'+esc(t('fHours'))+' <b id="fHoursLbl">'+hs+' h – '+he+' h</b></span>'+
        '<div class="sliders"><input type="range" id="fHourStart" class="hour-slider" min="0" max="24" step="1" value="'+hs+'">'+
        '<input type="range" id="fHourEnd" class="hour-slider" min="0" max="24" step="1" value="'+he+'"></div></div>'+
      '<div class="frow end"><button class="btn btn-ghost" data-act="clear-filters">'+esc(t('clear'))+'</button>'+
        '<button class="btn" data-act="apply-filters">'+esc(t('apply'))+'</button></div>'+
    '</div>';
  }
  function homeHtml(){
    var list=sortedEntries().filter(matchEntry), active=filtersActive(), shown, hasMore=false;
    if(active){ shown=list; } else { var cutoff=Date.now()-S.windowHours*3600e3; shown=list.filter(function(e){return e.createdAt>=cutoff;}); hasMore=list.some(function(e){return e.createdAt<cutoff;}); }
    var listHtml = S.store.entries.length===0 ? empty('emptyJournalT','emptyJournal','📝')
      : (shown.length ? shown.map(entryCard).join('') : '<div class="empty"><p>'+esc(t('noMatch'))+'</p></div>');
    return captureBox()+
      '<div class="jhead"><h2 class="jtitle">'+esc(t('journalTitle'))+'</h2>'+
        '<div class="jicons">'+
          '<button class="iconbtn xs'+(S.searchOpen?' on':'')+'" data-act="toggle-search" aria-label="'+esc(t('search'))+'">'+navIcon('search')+'</button>'+
          '<button class="iconbtn xs'+(S.filterOpen?' on':'')+(active?' active':'')+'" data-act="toggle-filter" aria-label="'+esc(t('filters'))+'">'+navIcon('filter')+'</button>'+
        '</div></div>'+
      (S.searchOpen?'<input id="homeSearch" class="field" placeholder="'+esc(t('searchPh'))+'" value="'+esc(S.filters.q)+'">':'')+
      (S.filterOpen?filterPanelHtml():'')+
      '<div id="journalList">'+listHtml+'</div>'+
      (hasMore?'<button class="btn btn-soft btn-block more" data-act="more">'+esc(t('more'))+'</button>':'');
  }

  function dataHtml(){
    if(!S.store.entries.length) return empty('emptyDataT','emptyData','🗂️');
    var recap=computeRecap(), view=S.dataView||'values';
    var rows=recap.map(function(r){
      var right = view==='values'
        ? '<span class="rv'+(r.absent?' rv-absent':'')+'">'+esc(r.value)+'</span>'
        : '<span class="score s'+r.score+'"><i class="dot"></i>'+esc(t('score'+r.score))+'</span>';
      return '<div class="rrow"><span class="rl"><span class="rl-ic">'+(CAT_EMOJI[r.key]||'')+'</span><span class="rl-name">'+esc(r.label)+'</span></span>'+right+'</div>'; }).join('');
    var rDays=S.store.recapDays||7;
    var recapHead='<div class="recap-titlewrap"><h3 class="recap-title">'+esc(t('recapTitle'))+'</h3><span class="recap-period">'+esc(t('recapPeriod').replace('{n}',rDays))+'</span></div>';
    var recapCard='<div class="card recap"><div class="recap-head">'+recapHead+
      seg([['values',t('viewValues')],['score',t('viewScore')]], view, 'dataview')+'</div><div class="recap-table">'+rows+'</div></div>';
    var byCat={};
    S.store.entries.forEach(function(e){ (e.signals||[]).forEach(function(s){ (byCat[s.category]=byCat[s.category]||[]).push({v:s.value||s.label, t:e.createdAt}); }); });
    var cards='';
    CAT_ORDER.forEach(function(key){ var items=byCat[key]; if(!items||!items.length) return;
      cards+='<details class="card cat"'+(['sleep','food','pain'].indexOf(key)>-1?' open':'')+'>'+
        '<summary><span class="c-ic">'+CAT_EMOJI[key]+'</span><span class="c-name">'+esc(catName(key))+'</span><span class="c-count">'+items.length+'</span></summary>'+
        '<ul>'+items.slice(0,40).map(function(it){ return '<li><span class="v">'+esc(it.v)+'</span><span class="d">'+esc(fmtDate(it.t))+'</span></li>'; }).join('')+'</ul></details>'; });
    return '<h1 class="page-title">'+esc(t('dataTitle'))+'</h1><p class="page-sub">'+esc(t('dataSub'))+'</p>'+ recapCard +
      '<h3 class="sec">'+esc(t('byTopic'))+'</h3><div class="cats-grid">'+cards+'</div>';
  }

  function corrHtml(){
    var dict=S.store.correlations||{}, last=S.store.lastAnalysisAt, W=S.store.corrWindow||3;
    var all=Object.keys(dict).map(function(k){return dict[k];});
    var stale=last && S.store.entries.some(function(e){return e.editedAt && e.editedAt>last;});
    var winExpl = W===1?t('winExpl_1'):(W===7?t('winExpl_7'):t('winExpl_3'));
    var winSection='<div class="corr-window">'+
      '<div class="cw-head"><span class="cw-title">'+esc(t('corrWindowTitle'))+'</span>'+
        seg([[1,t('win_24h')],[3,t('win_3d')],[7,t('win_1w')]], W, 'corrwindow')+'</div>'+
      '<p class="cw-expl">'+esc(winExpl)+'</p></div>';
    var head='<h1 class="page-title">'+esc(t('corrTitle'))+'</h1><p class="page-sub">'+esc(t('corrSub'))+'</p>'+
      winSection +
      (stale?'<div class="stale-banner">'+esc(t('corrStale'))+'</div>':'')+
      '<div class="analyze"><button class="btn" data-act="run-analysis">'+esc(t('update'))+'</button>'+
      '<span class="lastrun">'+ (last? esc(t('lastRun'))+' '+esc(fmtDate(last)) : esc(t('neverRun'))) +'</span></div>';
    function byRank(a,b){ return (b.pinned?1:0)-(a.pinned?1:0) || b.incidents-a.incidents; }
    var visible=all.filter(function(c){ return !c.hidden && (c.current || c.pinned); }).sort(byRank);
    var archived=all.filter(function(c){ return c.hidden || (!c.current && !c.pinned); }).sort(byRank);
    if(!visible.length && !archived.length){ return head+'<div class="empty"><div class="big">📊</div><p>'+esc(t('insufficient'))+'</p></div>'; }
    var mainHtml = visible.length ? visible.map(insightCard).join('') : '<p class="cw-expl">'+esc(t('noCurrentCorr'))+'</p>';
    var archiveHtml = archived.length ? '<details class="corr-archive"><summary>'+esc(t('showObsolete'))+' ('+archived.length+')</summary>'+
      '<div class="corr-archive-list">'+archived.map(insightCard).join('')+'</div></details>' : '';
    return head + mainHtml + archiveHtml;
  }

  function seg(opts,cur,act){ return '<span class="seg">'+opts.map(function(o){
      return '<button data-act="set-'+act+'" data-v="'+o[0]+'" class="'+(cur===o[0]?'on':'')+'">'+o[1]+'</button>'; }).join('')+'</span>'; }
  function settingsHtml(){
    return '<h1 class="page-title">'+esc(t('settingsTitle'))+'</h1>'+
      '<div class="card list">'+
        '<div class="row"><span class="k">'+esc(t('accTitle'))+' · '+esc(t('textSize'))+'</span><span class="sp"></span>'+ seg([['normal',t('tsNormal')],['large',t('tsLarge')]], S.textsize, 'textsize')+'</div>'+
        '<div class="row"><span class="k">'+esc(t('language'))+'</span><span class="sp"></span>'+ seg([['fr','Français'],['en','English']], S.lang, 'lang')+'</div>'+
        '<div class="row" style="border-bottom:none"><span class="k">'+esc(t('theme'))+'</span><span class="sp"></span>'+ seg([['turquoise','<span class="swatch" style="background:#118996"></span>'+t('themeTurq')],['coral','<span class="swatch" style="background:#F1514F"></span>'+t('themeCoral')]], S.theme, 'theme')+'</div>'+
      '</div>'+
      '<div class="card list" style="margin-top:14px">'+
        '<div class="row" style="border-bottom:none"><span class="k">'+esc(t('recapDaysLabel'))+'<small class="row-note">'+esc(t('recapDaysNote'))+'</small></span><span class="sp"></span>'+ seg([[7,'7 j'],[14,'14 j'],[30,'30 j']], S.store.recapDays||7, 'recapdays')+'</div>'+
      '</div>'+
      '<div class="card list" style="margin-top:14px">'+
        '<div class="row"><span class="k">'+esc(t('account'))+'</span><span class="sp"></span><span style="color:var(--muted)">'+esc(S.email||'')+'</span></div>'+
        '<div class="row"><span class="k">'+esc(t('password'))+'</span><span class="sp"></span><span class="pw-clear">'+ (prof().password ? esc(prof().password) : '<em style="color:var(--muted);font-weight:500">'+esc(t('pwUnknown'))+'</em>') +'</span></div>'+
        '<div class="row" style="border-bottom:none"><button class="btn btn-ghost btn-block" data-act="logout">'+esc(t('logout'))+'</button></div>'+
      '</div>'+
      '<div class="card list" style="margin-top:14px">'+
        '<div class="row"><button class="btn btn-soft btn-block" data-act="sample">'+esc(t('loadSample'))+'</button></div>'+
        '<div class="row"><button class="btn btn-ghost btn-block" data-act="export">'+esc(t('exportData'))+'</button></div>'+
        '<div class="row" style="border-bottom:none"><button class="btn btn-ghost btn-block" data-act="import">'+esc(t('importData'))+'</button>'+
          '<input type="file" id="importInput" accept="application/json,.json" style="display:none"></div>'+
      '</div>'+
      '<p class="note">'+esc(t('backupNote'))+'</p><p class="note">'+esc(t('legal'))+'</p>';
  }
  function tabbarHtml(){
    var tabs=[['home','navHome'],['data','navData'],['corr','navCorr'],['settings','navSettings']];
    return '<nav class="tabbar"><div class="inner">'+tabs.map(function(x){
      return '<button class="tab '+(S.tab===x[0]?'on':'')+'" data-act="tab" data-v="'+x[0]+'">'+navIcon(x[0])+'<span>'+esc(t(x[1]))+'</span></button>'; }).join('')+'</div></nav>';
  }

  /* ---------------- Échantillons / export / voix ---------------- */
  function loadSample(){
    var fr=['Mal dormi cette nuit, réveillée vers 4h. 5h de sommeil environ.',
      'Dîner fromage et lait hier soir. Mains raides ce matin, temps humide et pluvieux.',
      'Bonne énergie aujourd’hui, marché 30 minutes au soleil.','Migraine en fin de journée, beaucoup de stress au travail.',
      'Encore un dîner laitier. Articulations douloureuses le lendemain, jour pluvieux.','Humeur calme, thé le matin, lecture le soir.',
      'Glycémie 110 mg/dl ce matin à jeun.','Fromage au déjeuner, raideur dans les mains, il fait humide dehors.'];
    var en=['Slept badly last night, awake around 4am. About 5 hours of sleep.','Cheese and milk for dinner yesterday. Stiff hands this morning, humid and rainy weather.',
      'Good energy today, walked 30 minutes in the sun.','Headache late in the day, lots of stress at work.',
      'Dairy dinner again. Painful joints the next day, rainy day.','Calm mood, tea in the morning, reading in the evening.',
      'Glucose 110 mg/dl this morning, fasting.','Cheese at lunch, stiffness in my hands, it is humid outside.'];
    var arr=(S.lang==='en'?en:fr), now=Date.now();
    arr.forEach(function(txt,i){ S.store.entries.push({ id:'s_'+i+'_'+now.toString(36), createdAt: now-(arr.length-i)*864e5 + 3600e3*((i*5)%12), text:txt, photo:null, signals:structureEntry(txt) }); });
    S.store.entries.sort(function(a,b){return b.createdAt-a.createdAt;}); persistStore(); S.tab='home'; render(); toast(t('saved'));
  }
  function exportData(){ var blob=new Blob([JSON.stringify(S.store,null,2)],{type:'application/json'});
    var name='wwfm-'+((S.email||'data').split('@')[0])+'.json';
    var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click(); a.remove(); }
  /* Importe un export complet (S.store) dans le compte courant. Remplace les données,
     mais conserve l'identité du compte (token/email/session) et son mot de passe. */
  function importData(text){
    var incoming; try{ incoming=JSON.parse(text); }catch(e){ toast(t('importErr')); return; }
    if(!incoming || typeof incoming!=='object' || !Array.isArray(incoming.entries)){ toast(t('importErr')); return; }
    if(S.store.entries && S.store.entries.length){ if(!window.confirm(t('importConfirm'))) return; }
    var keepPw=prof().password;
    var s=normStore(incoming);
    if(keepPw!==undefined) s.profile.password=keepPw; else delete s.profile.password;
    S.store=s; applyProfile(); applyTheme(); applyTextsize(); persistStore(); S.tab='home'; render(); toast(t('importDone'));
  }
  function toggleMic(){ var SR=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SR){ toast(t('micOff')); return; }
    if(S.recOn && S.rec){ S.rec.stop(); return; }
    var r=new SR(); S.rec=r; r.lang=S.lang==='fr'?'fr-FR':'en-US'; r.interimResults=true; r.continuous=true;
    var base=(document.getElementById('capInput')||{}).value||'';
    r.onresult=function(ev){ var txt=''; for(var i=0;i<ev.results.length;i++) txt+=ev.results[i][0].transcript;
      var ta=document.getElementById('capInput'); if(ta){ ta.value=(base?base+' ':'')+txt; S.draft=ta.value; } };
    r.onend=function(){ S.recOn=false; S.rec=null; render(); }; r.onerror=function(){ S.recOn=false; };
    try{ r.start(); S.recOn=true; render(); }catch(e){}
  }

  /* ---------------- Événements ---------------- */
  document.addEventListener('click', function(ev){
    if(ev.target.classList.contains('edit-backdrop')){ S.editingId=null; S.editDraft=''; S.editSigs=[]; S.editSigsDirty=false; render(); return; }
    var el=ev.target.closest('[data-act]'); if(!el) return;
    var act=el.getAttribute('data-act'), v=el.getAttribute('data-v');
    if(act==='toggleAuth'){ ev.preventDefault(); render._authMode=(render._authMode==='signup'?'login':'signup'); renderAuth(); return; }
    if(act==='auth'){ doAuth(render._authMode, document.getElementById('f_email').value, document.getElementById('f_pass').value, function(m){ var er=document.getElementById('authErr'); if(er)er.textContent=m; }); return; }
    if(act==='tab'){ S.tab=v; if(v!=='home'){ S.searchOpen=false; S.filterOpen=false; } render(); window.scrollTo(0,0); return; }
    if(act==='add'){ var ta=document.getElementById('capInput'); addEntry(ta?ta.value:S.draft, S.draftPhoto); return; }
    if(act==='quick'){ var q=document.getElementById('capInput'); if(q){ q.value=t(v); S.draft=q.value; q.focus(); q.setSelectionRange(q.value.length,q.value.length); } return; }
    if(act==='mic'){ toggleMic(); return; }
    if(act==='photo'){ var pin=document.getElementById('photoInput'); if(pin) pin.click(); return; }
    if(act==='rm-photo'){ S.draftPhoto=null; render(); return; }
    if(act==='toggle-search'){ S.searchOpen=!S.searchOpen; if(!S.searchOpen) S.filters.q=''; render(); return; }
    if(act==='toggle-filter'){ S.filterOpen=!S.filterOpen; if(S.filterOpen) pendingTag=S.filters.tag; render(); return; }
    if(act==='tag'){ ev.preventDefault(); pendingTag=(pendingTag===v?'':(v||''));
      var nodes=document.querySelectorAll('.tagchips [data-act=tag]'); for(var i=0;i<nodes.length;i++){ var dv=nodes[i].getAttribute('data-v')||''; nodes[i].classList.toggle('on', dv===pendingTag); } return; }
    if(act==='apply-filters'){ var ff=document.getElementById('fFrom'), ft=document.getElementById('fTo');
      var hs=+( (document.getElementById('fHourStart')||{}).value )||0, he=+( (document.getElementById('fHourEnd')||{}).value ); if(isNaN(he)) he=24; if(hs>he){ var tmp=hs; hs=he; he=tmp; }
      S.filters={ q:S.filters.q, dateFrom: ff?ff.value:'', dateTo: ft?ft.value:'', tag: pendingTag||'', hourStart:hs, hourEnd:he }; S.windowHours=24; S.filterOpen=false; render(); return; }
    if(act==='clear-filters'){ pendingTag=''; S.filters={q:S.filters.q,dateFrom:'',dateTo:'',tag:'',hourStart:0,hourEnd:24}; S.windowHours=24; S.filterOpen=false; render(); return; }
    if(act==='more'){ S.windowHours+=24; render(); return; }
    if(act==='run-analysis'){ runAnalysis(); return; }
    if(act==='set-corrwindow'){ S.store.corrWindow=parseInt(v,10)||3; runAnalysis(); return; }
    if(act==='corr-pin'){ var cp=(S.store.correlations||{})[v]; if(cp){ cp.pinned=!cp.pinned; persistStore(); render(); } return; }
    if(act==='corr-hide'){ var ch=(S.store.correlations||{})[v]; if(ch){ ch.hidden=true; persistStore(); render(); } return; }
    if(act==='corr-unhide'){ var cu=(S.store.correlations||{})[v]; if(cu){ cu.hidden=false; persistStore(); render(); } return; }
    if(act==='set-recapdays'){ S.store.recapDays=parseInt(v,10)||7; persistStore(); render(); return; }
    if(act==='set-dataview'){ S.dataView=v; render(); return; }
    if(act==='set-lang'){ setLang(v); return; }
    if(act==='set-theme'){ setTheme(v); return; }
    if(act==='set-textsize'){ setTextsize(v); return; }
    if(act==='logout'){ logout(); return; }
    if(act==='sample'){ loadSample(); return; }
    if(act==='export'){ exportData(); return; }
    if(act==='import'){ var ii=document.getElementById('importInput'); if(ii) ii.click(); return; }
    if(act==='edit-open'){
      var entry=S.store.entries.find(function(e){return e.id===v;}); if(!entry) return;
      S.editingId=v; S.editDraft=entry.text||''; S.editSigs=(entry.signals||[]).slice(); S.editSigsDirty=false; render(); return; }
    if(act==='edit-cancel'){ S.editingId=null; S.editDraft=''; S.editSigs=[]; S.editSigsDirty=false; render(); return; }
    if(act==='edit-save'){
      var e2=S.store.entries.find(function(e){return e.id===S.editingId;});
      if(e2){ e2.text=S.editDraft; e2.signals=S.editSigsDirty && S.editSigs.length ? S.editSigs : structureEntry(S.editDraft); e2.editedAt=Date.now(); persistStore(); }
      S.editingId=null; S.editDraft=''; S.editSigs=[]; S.editSigsDirty=false; render(); return; }
    if(act==='edit-delete'){
      S.store.entries=S.store.entries.filter(function(e){return e.id!==S.editingId;});
      S.editingId=null; S.editDraft=''; S.editSigs=[]; S.editSigsDirty=false; persistStore(); render(); return; }
    if(act==='edit-rm-tag'){
      var idx=parseInt(v,10); S.editSigs.splice(idx,1); S.editSigsDirty=true; render(); return; }
    if(act==='edit-add-tag'){
      if(!S.editSigs.some(function(s){return s.category===v;})){
        S.editSigs.push({category:v,label:catName(v),value:null,confidence:1.0}); S.editSigsDirty=true; }
      render(); return; }
  });
  document.addEventListener('change', function(ev){ var el=ev.target;
    if(el && el.id==='photoInput' && el.files && el.files[0]){ handlePhoto(el.files[0]); el.value=''; return; }
    if(el && el.id==='importInput' && el.files && el.files[0]){ var fr=new FileReader(); fr.onload=function(e){ importData(e.target.result); }; fr.readAsText(el.files[0]); el.value=''; return; } });
  document.addEventListener('input', function(ev){
    var el=ev.target; if(!el) return;
    if(el.id==='capInput'){ S.draft=el.value; return; }
    if(el.id==='editInput'){ S.editDraft=el.value; return; }
    if(el.id==='homeSearch'){ S.filters.q=el.value; render(); return; }
    if(el.classList && el.classList.contains('hour-slider')){
      var a=+( (document.getElementById('fHourStart')||{}).value )||0, b=+( (document.getElementById('fHourEnd')||{}).value ); if(isNaN(b)) b=24;
      if(a>b){ var tt=a; a=b; b=tt; } var lbl=document.getElementById('fHoursLbl'); if(lbl) lbl.textContent=a+' h – '+b+' h'; return; }
  });
  document.addEventListener('keydown', function(ev){
    if(ev.key==='Enter' && !S.token){ var p=document.getElementById('f_pass'); if(p && document.activeElement===p){
      doAuth(render._authMode, document.getElementById('f_email').value, p.value, function(m){ var er=document.getElementById('authErr'); if(er)er.textContent=m; }); } }
  });

  /* ---------------- Boot ---------------- */
  (function init(){
    var sess=lsGet(LS_SESSION,null);
    if(sess){ S.token=sess.token; S.email=sess.email; if(sess.lang)S.lang=sess.lang; if(sess.theme)S.theme=sess.theme; if(sess.textsize)S.textsize=sess.textsize;
      var local=lsGet(lsStoreKey(sess.token),null); if(local) S.store=normStore(local); }
    applyTheme(); applyTextsize(); render(); if(S.token) loadStoreFromServer();
  })();
})();
