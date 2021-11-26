import Navbar from "../../components/Navbar";
import NavbarGuest from "../../components/NavbarGuest";
import SearchLokasiInput from "./SearchLokasiInput";
import CategoryDropdown from "./CategoryDropdown";
import SortDropdown from "./SortDropdown";
import useGetMusicianByFilter from "../../hooks/useGetMusicianByFilter";
import Loading from "../../components/Loading";
import { useEffect, useState } from "react";
import MusicianList from "./MusicianList";

export default function Explore() {
	const [filter, setFilter] = useState({
		date_published: "desc",
		location: "",
		instrument: [
			"Vokal",
			"Gitar",
			"Bass",
			"Brass",
			"Perkusi",
			"Piano",
			"Strings",
		],
		offset: 0,
	});
	const handleFilter = (value) => {
		setFilter({ ...filter, ...value });
	};
	const { dataFilter, loadingFilter, errorFilter } =
		useGetMusicianByFilter(filter);

	if (errorFilter) console.log(errorFilter);
	if (!loadingFilter) console.log(dataFilter);

	useEffect(() => {
		console.log(filter);
	}, [filter]);

	return (
		<div className="pb-3">
			<NavbarGuest />
			<div className="container mt-4">
				<h1 className="fw-bold">Cari musisi</h1>
			</div>
			<div
				className="container mt-4 d-flex flex-column flex-md-row sticky-top bg-white w-100 py-4"
				style={{ zIndex: 1 }}
			>
				<SearchLokasiInput onChange={handleFilter} />
				<div className="d-flex flex-row mt-3 mt-md-0">
					<CategoryDropdown onClick={handleFilter} />
					<SortDropdown onClick={handleFilter} />
				</div>
			</div>
			<div className="container my-3">
				{!loadingFilter ? (
					dataFilter.user.length === 0 ? (
						<div>
							<p>Tidak ditemukan hasil yang cocok.</p>
						</div>
					) : (
						<MusicianList entries={dataFilter.user} />
					)
				) : (
					<Loading />
				)}
			</div>
		</div>
	);
}
