import { Fragment, useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import NavbarGuest from "../../components/NavbarGuest";
import ConfirmationModal from "../../components/ConfirmationModal";
import styles from "./Profile.module.css";
import { useSelector } from "react-redux";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import useUpdateUser from "../../hooks/useUpdateUser";
import Loading from "../../components/Loading";
import { useNavigate, useParams } from "react-router-dom";
import Error from "../../components/Error";
import useUpdateUserStatus from "../../hooks/useUpdateUserStatus";

export default function Profile() {
	const navigate = useNavigate();
	const isLoggedIn = useSelector((state) => state.auth.login);
	const userId = useSelector((state) => state.auth.userId);
	const { id } = useParams();

	const [openModal, setOpenModal] = useState(false);
	const [editField, setEditField] = useState(false);
	const [form, setForm] = useState({
		img_link: "",
		full_name: "",
		location: "",
		instrument: "",
		phone: "",
		email: "",
		about: "",
		published: false,
	});

	const { dataProfile, loadingProfile, errorProfile } =
		useGetUserProfile(userId);
	const { updateUser, loadingUpdate } = useUpdateUser();
	const { updateUserStatus, loadingUpdateStatus } = useUpdateUserStatus();

	if (errorProfile) console.log(errorProfile);

	useEffect(() => {
		let mounted = true;
		const onMount = () => {
			if (
				!loadingProfile &&
				!loadingUpdate &&
				!loadingUpdateStatus &&
				dataProfile
			) {
				setForm({ ...dataProfile.user_by_pk });
			}
		};
		if (mounted) onMount();
		return () => {
			mounted = false;
		};
	}, [loadingUpdateStatus, loadingUpdate, loadingProfile, dataProfile]);

	const handleModal = (value) => {
		if (value.hasOwnProperty("published")) {
			updateUserStatus({ variables: { id: id, ...value } });
			setOpenModal(false);
		} else {
			setOpenModal(value);
		}
	};

	const onChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		setForm({ ...form, [name]: value });
	};

	const onClickEdit = () => {
		setEditField(!editField);
	};

	const onClickSave = () => {
		updateUser({ variables: { id: id, ...form } });
		setEditField(!editField);
	};

	if (userId === -1 || userId !== parseInt(id)) {
		return <Error code={401} message={"Unauthorized"} />;
	}

	return (
		<div>
			{!isLoggedIn ? <NavbarGuest /> : <Navbar />}
			<div className="container py-4 ">
				<h2 className="fw-bolder">Profile Detail</h2>
				{loadingProfile || loadingUpdate || loadingUpdateStatus ? (
					<div className="position-absolute top-50 start-50 translate-middle">
						<Loading />
					</div>
				) : !loadingProfile &&
				  !loadingUpdate &&
				  !loadingUpdateStatus &&
				  dataProfile ? (
					<Fragment>
						<form className="d-flex flex-column flex-md-row mt-5 justify-content-center">
							<img
								src={form.img_link}
								alt="musician"
								className={`${styles.profile} rounded me-md-4`}
							/>
							<div className={`${styles.form} d-flex flex-column mt-4 mt-md-0`}>
								<label className="fw-bolder fs-5">
									Nama Lengkap
									<div
										className={`d-flex mb-4 justify-content-between`}
										style={{ borderBottom: "1px solid #C4C4C4" }}
									>
										<input
											className="border-0 bg-white fs-6 w-100"
											style={{ outline: "none" }}
											type="text"
											name="full_name"
											value={form.full_name}
											disabled={!editField}
											onChange={onChange}
										/>
									</div>
								</label>
								<label className="fw-bolder fs-5">
									Lokasi
									<div
										className={`d-flex mb-4 justify-content-between`}
										style={{ borderBottom: "1px solid #C4C4C4" }}
									>
										<input
											className="border-0 bg-white fs-6 w-100"
											style={{ outline: "none" }}
											type="text"
											name="location"
											value={form.location}
											disabled={!editField}
											onChange={onChange}
										/>
									</div>
								</label>
								<label className="fw-bolder fs-5">
									Instrumen
									<div
										className={`d-flex mb-4 justify-content-between`}
										style={{ borderBottom: "1px solid #C4C4C4" }}
									>
										<select
											className="border-0 bg-white fs-6 w-100"
											style={{ appearance: "none", outline: "none" }}
											name="instrument"
											value={form.instrument}
											disabled={!editField}
											onChange={onChange}
										>
											<option value="-">-</option>
											<option value="Vokal">Vokal</option>
											<option value="Gitar">Gitar</option>
											<option value="Bass">Bass</option>
											<option value="Brass">Brass</option>
											<option value="Perkusi">Perkusi</option>
											<option value="Piano">Piano</option>
											<option value="Strings">Strings</option>
										</select>
									</div>
								</label>
								<label className="fw-bolder fs-5">
									No. Handphone
									<div
										className={`d-flex mb-4 justify-content-between`}
										style={{ borderBottom: "1px solid #C4C4C4" }}
									>
										<input
											className="border-0 bg-white fs-6 w-100"
											style={{ outline: "none" }}
											type="number"
											name="phone"
											value={form.phone}
											disabled={!editField}
											onChange={onChange}
										/>
									</div>
								</label>
								<label className="fw-bolder fs-5">
									Email
									<div
										className={`d-flex mb-4 justify-content-between`}
										style={{ borderBottom: "1px solid #C4C4C4" }}
									>
										<input
											className="border-0 bg-white fs-6 w-100"
											style={{ outline: "none" }}
											type="email"
											name="email"
											value={form.email}
											disabled={!editField}
											onChange={onChange}
										/>
									</div>
								</label>
								<label className="fw-bolder fs-5">
									Tentang
									<div
										className={`d-flex mb-4 justify-content-between`}
										style={{ borderBottom: "1px solid #C4C4C4" }}
									>
										<input
											className="border-0 bg-white fs-6 w-100"
											style={{ outline: "none" }}
											type="textarea"
											name="about"
											value={form.about}
											disabled={!editField}
											onChange={onChange}
										/>
									</div>
								</label>
								{!editField ? (
									<button
										className={`${styles.button2} rounded p-2 px-3 ms-auto`}
										type="button"
										onClick={onClickEdit}
									>
										Edit
									</button>
								) : (
									<button
										className={`${styles.button1} rounded p-2 px-3 ms-auto`}
										type="button"
										onClick={onClickSave}
									>
										Save
									</button>
								)}
							</div>
						</form>
						<div className="d-flex justify-content-center py-4">
							<button
								className={`${
									!form.published
										? `${styles.buttonDisabled}`
										: `${styles.button1}`
								} rounded p-2 px-3 me-3`}
								onClick={() => {
									navigate(`/musician/${userId}`);
								}}
								disabled={!form.published}
							>
								View Page
							</button>
							{!form.published ? (
								<button
									className={`${styles.button1} rounded p-2 px-3`}
									onClick={() => {
										handleModal(!openModal);
									}}
								>
									Publish Profile
								</button>
							) : (
								<button
									className={`${styles.button2} rounded p-2 px-3`}
									onClick={() => {
										handleModal(!openModal);
									}}
								>
									Unpublish Profile
								</button>
							)}
						</div>
					</Fragment>
				) : (
					""
				)}
			</div>
			{openModal && (
				<ConfirmationModal onClick={handleModal} published={form.published} />
			)}
		</div>
	);
}
