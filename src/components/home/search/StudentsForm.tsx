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
					<h2 className="text-lg font-medium mt-4">Status Oportunidade</h2>
					<div className="grid grid-cols-2 gap-4 mt-4">
						<Field
							placeholder="Status Meta"
							id="targetStatus"
							value={formData.targetStatus}
							label="Status Meta"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									targetStatus: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Status Atual"
							id="realStatus"
							value={formData.realStatus}
							label="Status Atual"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									realStatus: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Status Oportunidade"
							id="holderContractStatus"
							value={formData.holderContractStatus}
							label="Status Oportunidade"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									holderContractStatus: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Status RH"
							id="hrProfile"
							value={formData.hrProfile}
							label="Status RH"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									hrProfile: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Status duplicado Meta"
							id="duplicatedTargetStatus"
							value={formData.duplicatedTargetStatus}
							label="Status duplicado Meta"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									duplicatedTargetStatus: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Status duplicado Atual"
							id="duplicatedCurrentStatus"
							value={formData.duplicatedCurrentStatus}
							label="Status duplicado Atual"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									duplicatedCurrentStatus: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
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

					<h2 className="text-lg font-medium mt-4">
						Mês a mês Status Oportunidade - Referência a oportunidade atual -
						Preenchimento automático
					</h2>
					<div className="grid grid-cols-2 gap-4 mt-4">
						<Field
							placeholder="Jan"
							id="jan"
							value={formData.jan}
							label="Jan"
							onChange={value => {
								setFormData(prev => ({ ...prev, jan: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Feb"
							id="feb"
							value={formData.feb}
							label="Feb"
							onChange={value => {
								setFormData(prev => ({ ...prev, feb: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Mar"
							id="mar"
							value={formData.mar}
							label="Mar"
							onChange={value => {
								setFormData(prev => ({ ...prev, mar: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Apr"
							id="apr"
							value={formData.apr}
							label="Apr"
							onChange={value => {
								setFormData(prev => ({ ...prev, apr: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="May"
							id="may"
							value={formData.may}
							label="May"
							onChange={value => {
								setFormData(prev => ({ ...prev, may: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Jun"
							id="jun"
							value={formData.jun}
							label="Jun"
							onChange={value => {
								setFormData(prev => ({ ...prev, jun: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Jul"
							id="jul"
							value={formData.jul}
							label="Jul"
							onChange={value => {
								setFormData(prev => ({ ...prev, jul: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Aug"
							id="aug"
							value={formData.aug}
							label="Aug"
							onChange={value => {
								setFormData(prev => ({ ...prev, aug: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Sep"
							id="sep"
							value={formData.sep}
							label="Sep"
							onChange={value => {
								setFormData(prev => ({ ...prev, sep: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Oct"
							id="oct"
							value={formData.oct}
							label="Oct"
							onChange={value => {
								setFormData(prev => ({ ...prev, oct: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Nov"
							id="nov"
							value={formData.nov}
							label="Nov"
							onChange={value => {
								setFormData(prev => ({ ...prev, nov: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="Dec"
							id="dec"
							value={formData.dec}
							label="Dec"
							onChange={value => {
								setFormData(prev => ({ ...prev, dec: value.target.value }));
							}}
							readonly={!isEditing}
						/>
					</div>

					<h2 className="text-lg font-medium mt-4">
						Mês a Mês Status - Preenchimento Automático
					</h2>
					<div className="grid grid-cols-2 gap-4 mt-4">
						<Field
							placeholder="January"
							id="january"
							value={formData.january}
							label="January"
							onChange={value => {
								setFormData(prev => ({ ...prev, january: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="February"
							id="february"
							value={formData.february}
							label="February"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									february: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="March"
							id="march"
							value={formData.march}
							label="March"
							onChange={value => {
								setFormData(prev => ({ ...prev, march: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="April"
							id="april"
							value={formData.april}
							label="April"
							onChange={value => {
								setFormData(prev => ({ ...prev, april: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="May (full)"
							id="mayFull"
							value={formData.mayFull}
							label="May (full)"
							onChange={value => {
								setFormData(prev => ({ ...prev, mayFull: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="June"
							id="june"
							value={formData.june}
							label="June"
							onChange={value => {
								setFormData(prev => ({ ...prev, june: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="July"
							id="july"
							value={formData.july}
							label="July"
							onChange={value => {
								setFormData(prev => ({ ...prev, july: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="August"
							id="august"
							value={formData.august}
							label="August"
							onChange={value => {
								setFormData(prev => ({ ...prev, august: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="September"
							id="september"
							value={formData.september}
							label="September"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									september: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="October"
							id="october"
							value={formData.october}
							label="October"
							onChange={value => {
								setFormData(prev => ({ ...prev, october: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="November"
							id="november"
							value={formData.november}
							label="November"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									november: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="December"
							id="december"
							value={formData.december}
							label="December"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									december: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
					</div>

					<h2 className="text-lg font-medium mt-4">
						Mês a mês Status Oportunidade - Referência a Meta - Cálculo
						Automático
					</h2>
					<div className="grid grid-cols-2 gap-4 mt-4">
						<Field
							placeholder="January 2"
							id="january2"
							value={formData.january2}
							label="January 2"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									january2: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="February 2"
							id="february2"
							value={formData.february2}
							label="February 2"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									february2: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="March 2"
							id="march2"
							value={formData.march2}
							label="March 2"
							onChange={value => {
								setFormData(prev => ({ ...prev, march2: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="April 2"
							id="april2"
							value={formData.april2}
							label="April 2"
							onChange={value => {
								setFormData(prev => ({ ...prev, april2: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="May 2"
							id="may2"
							value={formData.may2}
							label="May 2"
							onChange={value => {
								setFormData(prev => ({ ...prev, may2: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="June 2"
							id="june2"
							value={formData.june2}
							label="June 2"
							onChange={value => {
								setFormData(prev => ({ ...prev, june2: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="July 2"
							id="july2"
							value={formData.july2}
							label="July 2"
							onChange={value => {
								setFormData(prev => ({ ...prev, july2: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="August 2"
							id="august2"
							value={formData.august2}
							label="August 2"
							onChange={value => {
								setFormData(prev => ({ ...prev, august2: value.target.value }));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="September 2"
							id="september2"
							value={formData.september2}
							label="September 2"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									september2: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="October 2"
							id="october2"
							value={formData.october2}
							label="October 2"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									october2: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="November 2"
							id="november2"
							value={formData.november2}
							label="November 2"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									november2: value.target.value,
								}));
							}}
							readonly={!isEditing}
						/>
						<Field
							placeholder="December 2"
							id="december2"
							value={formData.december2}
							label="December 2"
							onChange={value => {
								setFormData(prev => ({
									...prev,
									december2: value.target.value,
								}));
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
