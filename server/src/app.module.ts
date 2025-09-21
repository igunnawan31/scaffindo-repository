import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerService } from './logger/logger.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { CertificationsModule } from './certifications/certifications.module';
import { LabelsModule } from './labels/labels.module';
import { InvoicesModule } from './invoices/invoices.module';
import { TrackingsModule } from './trackings/trackings.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    ProductsModule,
    UsersModule,
    CertificationsModule,
    LabelsModule,
    InvoicesModule,
    TrackingsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    LoggerService,
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule {}
