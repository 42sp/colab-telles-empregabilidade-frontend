import { Card, CardContent } from "@/components/ui/card";
import { FormInput } from "@/components/ui/formInput";
import { UserRound, Lock, Key } from "lucide-react";

export function LinkedInAuth() {
	return (
		<Card role="form" aria-label="Autenticação LinkedIn">
			<CardContent>
				<div
					className="flex flex-col md:flex-row flex-wrap gap-6"
					role="group"
					aria-label="Campos de autenticação LinkedIn"
				>
					<div className="flex-1 min-w-[240px]">
						<FormInput
							name="linkedinUser"
							label="Usuário LinkedIn"
							placeholder="Seu usuário do LinkedIn"
							iconPrepend={<UserRound />}
						/>
					</div>

					<div className="flex-1 min-w-[240px]">
						<FormInput
							name="linkedinPassword"
							label="Senha LinkedIn"
							type="password"
							placeholder="Sua senha do LinkedIn"
							iconPrepend={<Lock />}
						/>
					</div>

					<div className="flex-1 min-w-[240px]">
						<FormInput
							name="linkedinToken"
							label="Token"
							placeholder="Token de acesso"
							iconPrepend={<Key />}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
