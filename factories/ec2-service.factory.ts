import { EC2Service } from '../services/ec2-service.js';

export class EC2ServiceFactory {
    static create(): EC2Service {
        return new EC2Service();
    }
}