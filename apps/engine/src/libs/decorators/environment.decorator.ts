import { Reflector } from "@nestjs/core";
import { DeploymentEnvironment } from "../../utils/environment";

export const Environments =
    Reflector.createDecorator<DeploymentEnvironment[]>();
