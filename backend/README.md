# Backend notes

## AI status endpoint

`GET /api/ai/status` is an authenticated, read-only endpoint. It reports whether
`GEMINI_API_KEY` is configured and which model is selected; it does not generate
a lead summary and does not require a request body.

The handler is `aiStatus` in `controllers/ai.controller.js`. It was changed
because the previous handler called `resolveLead(req)`, which requires a
`leadId` or inline `lead` in the request body. A normal GET status request has
neither and therefore returned 400.

To deliberately restore the previous behavior, replace the `aiStatus` handler
with:

```js
export const aiStatus = asyncHandler(async (req,res)=>{
    const lead = await resolveLead(req);
    const result = await generateLeadSummary(lead);

    if(req.body.leadId){
        await Lead.updateOne(
            {_id: req.body.leadId , owner: req.user._id},
            {$set: {aiSummary: result.summary, aiRiskScore: result.aiRiskScore}}
        );
    }

    res.json({success: true, ...result})
})
```

Restoring this code also restores the requirement for lead data in the request
body, so a body-less GET request will return 400 again.
