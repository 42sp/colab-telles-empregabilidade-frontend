import { Field } from "@/components/ui/field";
import type * as collection from "../../../types/requests/index";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useServices } from "@/hooks/useServices";
import { toast } from "react-hot-toast";
import { ToastContainer } from "react-toastify";

interface StudentsFormProps {
	data: collection.StudentsParameters;
	className?: string;
	cancelar?: () => void;
	updateHome?: () => void;
}

const StudentsForm = (props: StudentsFormProps) => {
	const [formData, setFormData] = useState<collection.StudentsParameters>(
		props.data
	);

	const service = useServices();

	const handleSave = async () => {
		const response = await toast.promise(service.putStudents(formData), {
			loading: "Atualizando informações...",
			success: "Informações atualizadas com sucesso 👌",
			error: "Erro ao atualizar informações 🤯",
		});

		if (response && [200, 201].includes(response.status)) {
			setIsEditing(false);
			if (props.updateHome) {
				props.updateHome();
			}
		}
	};

	const [isEditing, setIsEditing] = useState(false);

	const scrollRef = useRef<HTMLDivElement>(null);

	return (
		<>
			<ToastContainer position="top-center" hideProgressBar={true} />
			<ScrollArea className={props.className} ref={scrollRef}>
				<div>
					<h2 className="text-lg font-medium mt-4">Informações cadastrais</h2>
					<div className="grid grid-cols-2 gap-4 mt-4">
						<Field
							placeholder="Nome"
							id="name"
							value={formData.name}
							label="Nome"
							onChange={value => {
								setFormData(prev => ({ ...prev, name: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Nome Social"
							id="socialName"
							value={formData.socialName}
							label="Nome Social"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									socialName: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Nome Preferencial"
							id="preferredName"
							value={formData.preferredName}
							label="Nome Preferencial"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									preferredName: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Email Ismart"
							id="ismartEmail"
							value={formData.ismartEmail}
							label="Email Ismart"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									ismartEmail: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Telefone"
							id="phoneNumber"
							value={formData.phoneNumber}
							label="Telefone"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									phoneNumber: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Gênero"
							id="gender"
							value={formData.gender}
							label="Gênero"
							onChange={value => {
								setFormData(prev => ({ ...prev, gender: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Orientação Sexual"
							id="sexualOrientation"
							value={formData.sexualOrientation}
							label="Orientação Sexual"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									sexualOrientation: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Raça/Etnia"
							id="raceEthnicity"
							value={formData.raceEthnicity}
							label="Raça/Etnia"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									raceEthnicity: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						<label className="flex items-center gap-2">
							<input
								type="checkbox"
								name="hasDisability"
								checked={formData.hasDisability}
								onChange={e => {
									setFormData(prev => ({
										...prev,
										hasDisability: e.target.checked,
									}));
								}}
								disabled={!isEditing}
							/>
							Possui deficiência
						</label>
						<Field
							placeholder="Linkedin"
							id="linkedin"
							value={formData.linkedin}
							label="Linkedin"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									linkedin: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						{/* <Field placeholder="RA" id="ra" value={formData.ra} label="RA" /> */}
					</div>
					

					<h2 className="text-lg font-medium mt-4">Público Meta</h2>
					<div className="grid grid-cols-2 gap-4 mt-4">
						<Field
							placeholder="Público Meta"
							id="targetAudience"
							value={formData.targetAudience}
							label="Público Meta"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									targetAudience: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
					</div>

					<h2 className="text-lg font-medium mt-4">Oportunidades</h2>
					<div className="grid grid-cols-2 gap-4 mt-4">
						<Field
							placeholder="Tipo de oportunidade"
							id="opportunityType"
							value={formData.opportunityType}
							label="Tipo de oportunidade"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									opportunityType: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Detalhes"
							id="details"
							value={formData.details}
							label="Detalhes"
							onChange={value => {
								setFormData(prev => ({ ...prev, details: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Setor"
							id="sector"
							value={formData.sector}
							label="Setor"
							onChange={value => {
								setFormData(prev => ({ ...prev, sector: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Trilha de carreira"
							id="careerTrack"
							value={formData.careerTrack}
							label="Trilha de carreira"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									careerTrack: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Organização"
							id="organization"
							value={formData.organization}
							label="Organização"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									organization: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Website"
							id="website"
							value={formData.website}
							label="Website"
							onChange={value => {
								setFormData(prev => ({ ...prev, website: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							type="date"
							placeholder="Data início"
							id="startDate"
							value={formData.startDate}
							label="Data início"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									startDate: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						<Field
							type="date"
							placeholder="Data fim"
							id="endDate"
							value={formData.endDate}
							label="Data fim"
							onChange={value => {
								setFormData(prev => ({ ...prev, endDate: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							type="number"
							placeholder="Compensação"
							id="compensation"
							value={formData.compensation}
							label="Compensação"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									compensation: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						<label className="flex items-center gap-2">
							<input
								type="checkbox"
								name="partnerCompanies"
								checked={!!formData.partnerCompanies}
								onChange={e => {
									setFormData(prev => ({
										...prev,
										partnerCompanies: e.target.checked ? "true" : "false",
									}));
								}}
								disabled={!isEditing}
							/>
							Empresas parceiras
						</label>
						<label className="flex items-center gap-2">
							<input
								type="checkbox"
								name="topGlobalCompanies"
								checked={!!formData.topGlobalCompanies}
								onChange={e => {
									setFormData(prev => ({
										...prev,
										topGlobalCompanies: e.target.checked ? "true" : "false",
									}));
								}}
								disabled={!isEditing}
							/>
							Top empresas globais
						</label>
						<Field
							placeholder="Comentários"
							id="comments"
							value={formData.comments}
							label="Comentários"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									comments: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Tag"
							id="tag"
							value={formData.tag}
							label="Tag"
							onChange={value => {
								setFormData(prev => ({ ...prev, tag: value.target.value }));
							}}
							readonly={!isEditing}
						/>
					</div>
					
				</div>
			</ScrollArea>

			{!isEditing ? (
				<Button
					variant="secondary"
					className="mt-4"
					onClick={() => setIsEditing(true)}
				>
					Editar
				</Button>
			) : (
				<>
					<Button
						variant="default"
						className="mt-4"
						onClick={() => handleSave()}
					>
						Salvar
					</Button>
					<Button variant="secondary" className="mt-4" onClick={props.cancelar}>
						Cancelar
					</Button>
				</>
			)}
		</>
	);
};

export default StudentsForm;
