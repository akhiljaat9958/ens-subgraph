import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class Subgraph {
    constructor(props?: Partial<Subgraph>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    owner!: string

    @Column_("text", {nullable: false})
    displayName!: string

    @Column_("text", {nullable: false})
    imageUrl!: string
}
