import {Controller, Get } from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {Roles} from "../auth/roles-auth.decorator";
import {StatisticsService} from "./statistics.service";
import {CategoriesStatistics} from "../categories/categories-statistics.model";

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {

    constructor(private readonly statisticsService: StatisticsService) {
    }

    @ApiOperation({summary: 'Get statistics'})
    @ApiResponse({status: 200, type: [CategoriesStatistics]})
    @Roles('admin', 'manager')
    @Get()
    getAll () {
        return this.statisticsService.getAll()
    }
}
