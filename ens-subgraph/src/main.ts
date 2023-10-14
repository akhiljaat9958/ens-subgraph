import { TypeormDatabase } from '@subsquid/typeorm-store'
import { Subgraph } from './model'
import { processor } from './processor'
import * as SubgraphABI from './abi/Gravity'
processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
    const subgraphs: Map<string,Subgraph> = new Map();
    for (let c of ctx.blocks) {
        for (let log of c.logs) {
            let {idString,owner,displayName,imageUrl}=extractData(log);
            let subgraph = new Subgraph({
                id:idString,
                owner,
                displayName,
                imageUrl,
        })
        subgraphs.set(idString,subgraph);

            }

        }
    

    // upsert batches of entities with batch-optimized ctx.store.save
    await ctx.store.upsert([...subgraphs.values()]);
});

function extractData(log: any): {
    idString: string;
    owner: string;
    displayName: string; 
    imageUrl: string;
} {
    if (log.topics[0]===SubgraphABI.events.NewSubgraph.topic){
                let { id, owner, displayName, imageUrl } = SubgraphABI.events.NewSubgraph.decode(log);
                let idString = id.toString(16);
                return{idString,owner,displayName,imageUrl};
    }
    if (log.topics[0]===SubgraphABI.events.UpdatedSubgraph.topic){
                let { id, owner, displayName, imageUrl } = SubgraphABI.events.UpdatedSubgraph.decode(log);
                let idString = id.toString(16);
                return{idString,owner,displayName,imageUrl};
    }
    throw new Error("Unsupported topic");
}
