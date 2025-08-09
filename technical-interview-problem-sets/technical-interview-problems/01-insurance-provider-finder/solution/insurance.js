/**
 * Find the most affordable insurance plan that covers the highest number of preferred providers.
 * 
 * @param {Array} preferredProviders - Array of provider objects with providerId and name
 * @param {Array} availableProviders - Array of provider objects with providerId, name, and networks
 * @param {Array} insurancePlans - Array of plan objects with planId, name, monthlyCost, and networks
 * @return {Object|null} The most affordable plan that covers the most preferred providers, or null if no plan covers any
 */
function findMostAffordablePlan(preferredProviders, availableProviders, insurancePlans) {
  // Create a set of preferred provider IDs for quick lookup
  const preferredProviderIds = new Set(preferredProviders.map(provider => provider.providerId));
  
  // Create a map of provider ID to networks for all preferred providers
  const providerNetworks = {};
  availableProviders.forEach(provider => {
    if (preferredProviderIds.has(provider.providerId)) {
      providerNetworks[provider.providerId] = new Set(provider.networks);
    }
  });
  
  // Calculate coverage for each plan
  const planCoverage = [];
  
  for (const plan of insurancePlans) {
    const planNetworks = new Set(plan.networks);
    let coveredProviders = 0;
    
    // Check each preferred provider to see if they're covered by this plan
    for (const providerId in providerNetworks) {
      // A provider is covered if any of their networks is in the plan's networks
      const providerNetworkSet = providerNetworks[providerId];
      
      // Check if there's an intersection between provider networks and plan networks
      for (const network of providerNetworkSet) {
        if (planNetworks.has(network)) {
          coveredProviders++;
          break; // Move to the next provider once we find a match
        }
      }
    }
    
    // Add plan with its coverage score to our results
    planCoverage.push({
      plan,
      coveredProviders
    });
  }
  
  // Sort plans by coverage (descending) and then by cost (ascending)
  planCoverage.sort((a, b) => {
    if (b.coveredProviders !== a.coveredProviders) {
      return b.coveredProviders - a.coveredProviders; // Higher coverage first
    }
    return a.plan.monthlyCost - b.plan.monthlyCost; // Lower cost first
  });
  
  // Return the best plan, or null if no plan covers any preferred providers
  return planCoverage.length > 0 && planCoverage[0].coveredProviders > 0 
    ? planCoverage[0].plan 
    : null;
}

module.exports = {
  findMostAffordablePlan
};
