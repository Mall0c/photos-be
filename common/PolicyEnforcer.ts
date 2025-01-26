import { newEnforcer, Enforcer } from 'casbin'

export class PolicyEnforcer {

    private static enforcer: Enforcer
    private constructor() {}

    public static async getEnforcer() {
        if (PolicyEnforcer.enforcer === undefined) {
            PolicyEnforcer.enforcer = await newEnforcer('../rbac_model.conf', 'policy.csv')
        }
        return PolicyEnforcer.enforcer
    }
}