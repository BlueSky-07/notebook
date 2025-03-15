import { forwardRef, Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { GeneratingTaskEntity } from "./generating-task.entity"
import { InngestModule } from "../inngest/inngest.module"
import { GeneratingTaskController } from "./generating-task.controller"
import { GeneratingTaskService } from "./generating-task.service"
import { FlowModule } from "../flow/flow.module"
import { NodeModule } from "../node/node.module"
import { EdgeModule } from "../edge/edge.module"

@Module({
  imports: [
    TypeOrmModule.forFeature([GeneratingTaskEntity]),
    FlowModule,
    forwardRef(() => NodeModule),
    forwardRef(() => EdgeModule),
    forwardRef(() => InngestModule),
  ],
  controllers: [GeneratingTaskController],
  providers: [GeneratingTaskService],
  exports: [GeneratingTaskService]
})
export class GeneratingTaskModule {}