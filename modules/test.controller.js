const express = require('express')


const util = require('util');
const fs = require('fs');



finalSolution = {}


const readDistances = () => {
  const fileToRead = 'distances/distance.json';
  const file = fs.readFileSync(fileToRead);
  return JSON.parse(file);
}

/* enable log */
const SHOW_DEBUG_LOG = true;
/* Show log  */
const log = (text) => SHOW_DEBUG_LOG && console.log('Log => ', text);
/* Function to inspect a variable */
const inspectVar = (t, v) => SHOW_DEBUG_LOG && console.log(`${t}:\n`, util.inspect(v, false, null, true));

const identifySameOrigins = (distances) => {
  /* Marking the same origin,same destination distances */
  distances.map((item, index) => {
    const copiedItem = item;
    if (index > 0) {
      copiedItem.elements[index - 1].sameOrigin = true;
    }
    return copiedItem;
  });
}
const cleanRouteObject = ({ distance, duration }) => {
  const newObj = {
    distance, duration,
  };
  return newObj;
};
const calculateCharges = (routeLength) => {
  /* Distance in miles */
  const dist = parseFloat((routeLength / 1610).toFixed(2));

  let deliveryCharges = 7.0;


  deliveryCharges = parseFloat(
    (dist + 1).toFixed(2),
  );
  if (dist < 2.5) {
    deliveryCharges = 1.0;
  } else if (dist > 2.49 && dist < 5) {
    deliveryCharges = 2.0;
  } else if (dist > 4.99 && dist < 7) {
    deliveryCharges = 3.0;
  } else if (dist < 10.01) {
    deliveryCharges = 5;
  } else {
    deliveryCharges = 10
  }

  return deliveryCharges;
};

const solution = () => {
  log('start of solution');
  const data = readDistances();
  const { origin_addresses: originAddresses,
    destination_addresses: destinationAddresses,
    rows: distances,
    customers
  } = data;
  const solution = [];
  identifySameOrigins(distances);


  /* 5 miles */
  const maxRouteLength = 8046 + (8046 * 0.3); // meters

  /* Parent Object */
  const calculations = {
    /* Distances of store from each customer */
    dosfec: distances[0].elements,
    /* Number of destinations */
    nod: destinationAddresses.length,
    /* Number of origins */
    nOrigins: originAddresses.length,
    /* All customers ready to be assigned to rider(s), default: no of destinations */
    customersRemaining: destinationAddresses.length,
    /* Number of riders currently allocated */
    routeNumber: 1,
    /* Previous total distance */
    prevDistance: 0,
    /* index for the last allocated customer */
    lastAllocated: 0,
    /* Delivery routes calculated */
    deliveryRoutes: [],
    /* Current Route */
    currentRoute: [],
  };
  while (calculations.customersRemaining > 0) {
    if (calculations.prevDistance === 0) {
      /* Find the customer closest to the store */
      // Set the first customer to be the closest by default
      let closest = 0;
      for (let i = 0; i < calculations.nod; i += 1) {
        /* If there is only one customer remaining
        and the is not allocated a route */
        if (calculations.customersRemaining < 2 && !calculations.dosfec[i].allocated) {
          /* Set this customer to be closest to the store */
          closest = i;
        } else if (
          /* If the distance of the last selected closest customer
          is greater than or equal to the current customer */
          calculations.dosfec[closest].distance.value
          >= calculations.dosfec[i].distance.value
          /* And of the the current customer is not allocated a route */
          && calculations.dosfec[i].allocated !== true) {
          /* Set the current customer in the loop to be the closest */
          closest = i;
        }
      }

      /* Set the route status for  customer that was found
      to be the closest to the store to be true i.e. A route
      was found found for this individual customer */
      calculations.dosfec[closest].allocated = true;
      /* Set the route number to this customer */
      calculations.dosfec[closest].routeNumber = calculations.routeNumber;
      /* Set the total distance of the current route to be distance of this route just created  */
      calculations.prevDistance = calculations.dosfec[closest].distance.value;
      /* Create a route object and remove any extra fields */
      const routeObject = {};
      /* Set the customer to the route */
      routeObject.customer = customers[closest];
      /* Get the charges for the customer using calculate charges method */
      routeObject.deliveryCharges = calculateCharges(calculations.dosfec[closest].distance.value);
      routeObject.path = `${calculations.dosfec[closest].distance.text}  from Store to ${customers[closest]}.`

      calculations.currentRoute.push(routeObject);
      /* Decremtnt the customers remaining to be assigned a route */
      calculations.customersRemaining -= 1;

      calculations.lastAllocated = closest;
    } else if (calculations.prevDistance > 0) {
      /* If the current route has at least one customer in it */
      /*
        and there are customers remaining
     */
      /* MAKE THIS VALUE FALSE BEFORE SOLVING. THIS MAKES SURE THAT THE LOOP DOES NOT RUN INFINITELY */
      const skipForTest = false;

      if (
        !skipForTest &&
        // If total distance of the route calcuated previously is less than maxlen
        (calculations.prevDistance < maxRouteLength)
        // Then check if there are customers remaining
        && calculations.customersRemaining) {
        // SOLUTION





        // Distance of customer from current origin
        docfcc = distances[calculations.lastAllocated + 1].elements;

        // let firt customer be closest to current origin        
        closest = 0;

        //finding the closest customer to current origin
        for (let i = 0; i < calculations.nod; i += 1) {
          /* If there is only one customer remaining
          and the is not allocated a route */
          if (calculations.customersRemaining < 2 && !calculations.dosfec[i].allocated && i != calculations.lastAllocated) {
            /* Set this customer to be closest to the current origin */
            closest = i;

          } else if (
            /* If the distance of the last selected closest customer
            is greater than or equal to the current customer */
            docfcc[closest].distance.value
            >= docfcc[i].distance.value
            /* And of the the current customer is not allocated a route */
            && calculations.dosfec[i].allocated !== true) {
            /* Set the current customer in the loop to be the closest */
            closest = i;
          }
        }


        //finding the total length of path 
        calculations.prevDistance += docfcc[closest].distance.value;
        //if the total length of path exceeds the maxRouteLength then exit the current execution of loop i.e don't add further customer to current path.
        if (calculations.prevDistance > maxRouteLength) { continue; }

        // if the total length remains valid then adding closest customer to path

        calculations.dosfec[closest].allocated = true;
        calculations.dosfec[closest].routeNumber = calculations.routeNumber;


        const routeObject = {};
        /* Set the customer to the route */
        routeObject.customer = customers[closest];
        /* Get the charges for the customer using calculate charges method */
        routeObject.deliveryCharges = calculateCharges(docfcc[closest].distance.value);
        routeObject.path = `${docfcc[closest].distance.text}  from ${customers[calculations.lastAllocated]} to ${customers[closest]}.`

        calculations.currentRoute.push(routeObject);
        /* Decremtnt the customers remaining to be assigned a route */
        calculations.customersRemaining -= 1;

        calculations.lastAllocated = closest;









      } else {

        // Increment the number of routes assigned
        calculations.routeNumber += 1;
        // Push the route calculated to the all deliveryRoutes 
        calculations.deliveryRoutes.push({ totalLength: `${parseFloat((calculations.prevDistance / 1610).toFixed(2))} miles from Store.`, route: calculations.currentRoute });
        // Set the total distance of the route to be zero
        calculations.prevDistance = 0;
        // set the current route be empty
        calculations.currentRoute = [];
      }
    }
    /* If there a no more customers remaining */

    if (calculations.customersRemaining < 1) {
      /* Push the current route in all deliveryRoutes in calculations */
      calculations.deliveryRoutes.push({ totalLength: `${parseFloat((calculations.prevDistance / 1610).toFixed(2))} miles from Store.`, route: calculations.currentRoute });
      /* Set the current route be empty */
      calculations.currentRoute = [];
    }
  }
  inspectVar('solution', calculations.deliveryRoutes)
  finalSolution=calculations.deliveryRoutes
  log('end of solution');
}

module.exports = {
  solution
}


//serving the results to a route using express


const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send(finalSolution)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})