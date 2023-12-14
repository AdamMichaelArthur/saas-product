                                <!-- State Buttons Documentation 

                                 'stateButtons': [
                                    {
                                      status: 'waiting_seller',   // This indicates that we are waiting on the seller to complete an action
                                      defaultState: true,
                                      column: 'headline',         // This is the column where the button is placed
                                      displayText: 'Complete',    // This is the text that will be displayed inside the button
                                      state: 'waiting_seller',    // Another state conditional
                                      displayConditional: true,
                                      conditionals: {
                                        seller_id: '$created_by', // This ensures that the seller_id and the created_by field are equal
                                        status: '$status'         // This ensures that the status is "waiting_seller" for both the current row and this object
                                      }
                                    },
                                    {
                                      status: 'waiting_seller',
                                      defaultState: true,
                                      column: 'headline',
                                      displayText: 'Complete',
                                      state: 'waiting_seller',
                                      displayConditional: true,
                                      conditionals: {
                                        seller_id: '$created_by',
                                        status: '$status'
                                      }
                                    },
                                 ],

                                -->