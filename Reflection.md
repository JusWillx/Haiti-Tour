# Reflection draft — review before submitting

I chose a Haiti history tour because my Haitian background is important to me, and I wanted the project to connect with something personal. I requested the Haitian flag colors and wanted users to explore historical landmarks while learning about their meaning. The cybersecurity connection is checking where information comes from and handling incomplete data honestly.

My feedback helped shape the second version. I pointed out that the first project was slow, difficult to use, and showed a grid instead of the actual places. AI helped rebuild it with satellite imagery and elevation through Cesium, a mobile layout, and touch flight controls. It also changed the code so the flight loop stops when paused and the text panel is not rewritten every frame. Slow Tour remains an optional feature rather than making every transition slow.

The missing-data exercise removed a historical source from a copy. The validator warned about the missing source, and the data test failed. Restoring that source repaired the test. This showed why a warning should lead to a real correction instead of being hidden.

One limitation is that satellite imagery and elevation are not detailed 3D models of the monuments. The flight also lacks realistic aircraft physics. I still need to review the code, complete my instructor’s exact manual checks, and get real partner feedback before submitting.
