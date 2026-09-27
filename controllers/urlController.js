const shortid = require('shortid');
const URL = require('../models/url');
const { models } = require('mongoose');


async function handleGenerateNewShortURL(req,res){
    const body = req.body;
    if(!body.url)
       return res.status(400).json({error:"url is required"});
    const ShortID = shortid();
    await URL.create({
      shortId:ShortID,
      requiredURL: body.url,
      visitHistory:[],
    });
    return res.json({id:ShortID});
}

async function handleGetAnalytics(req,res){
  const shortId = req.params.shortid;
  const result = await URL.findOne({ shortId: shortId});
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics : result.visitHistory
  });
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};