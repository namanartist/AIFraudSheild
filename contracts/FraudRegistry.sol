// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title FraudRegistry
 * @dev Stores immutable fraud report metadata, IPFS evidence CIDs, and AI risk predictions.
 * Does NOT store large media files on-chain; stores cryptographic IPFS references only.
 */
contract FraudRegistry {
    enum ReportStatus { Submitted, InReview, Verified, Rejected }

    struct FraudReport {
        uint256 reportId;
        address targetWallet;
        bytes32 txHash;
        string ipfsEvidenceCID;
        uint8 aiRiskScore;          // 0 - 100
        string aiDiagnosisSummary;
        address reporter;
        uint256 timestamp;
        ReportStatus status;
        uint256 yesVotes;
        uint256 noVotes;
        bool isResolved;
    }

    address public owner;
    address public daoContract;
    address public reputationContract;
    uint256 public reportCounter;

    mapping(uint256 => FraudReport) public reports;
    mapping(address => uint256[]) public walletReports;
    mapping(bytes32 => uint256) public txHashToReportId;

    event ReportSubmitted(
        uint256 indexed reportId,
        address indexed targetWallet,
        bytes32 indexed txHash,
        string ipfsCID,
        uint8 aiRiskScore,
        address reporter
    );

    event ReportStatusUpdated(
        uint256 indexed reportId,
        ReportStatus status,
        uint256 yesVotes,
        uint256 noVotes
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyAuthorized() {
        require(
            msg.sender == owner || msg.sender == daoContract,
            "Caller not authorized"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setDAOContract(address _dao) external onlyOwner {
        require(_dao != address(0), "Invalid DAO address");
        daoContract = _dao;
    }

    function setReputationContract(address _rep) external onlyOwner {
        require(_rep != address(0), "Invalid reputation address");
        reputationContract = _rep;
    }

    /**
     * @dev Submit a new fraud report with IPFS evidence CID and AI risk metrics
     */
    function submitReport(
        address _targetWallet,
        bytes32 _txHash,
        string memory _ipfsEvidenceCID,
        uint8 _aiRiskScore,
        string memory _aiDiagnosisSummary
    ) external returns (uint256) {
        require(_targetWallet != address(0), "Target wallet cannot be zero address");
        require(bytes(_ipfsEvidenceCID).length > 0, "IPFS CID required");
        require(_aiRiskScore <= 100, "AI risk score must be 0-100");

        reportCounter++;
        uint256 newId = reportCounter;

        reports[newId] = FraudReport({
            reportId: newId,
            targetWallet: _targetWallet,
            txHash: _txHash,
            ipfsEvidenceCID: _ipfsEvidenceCID,
            aiRiskScore: _aiRiskScore,
            aiDiagnosisSummary: _aiDiagnosisSummary,
            reporter: msg.sender,
            timestamp: block.timestamp,
            status: ReportStatus.Submitted,
            yesVotes: 0,
            noVotes: 0,
            isResolved: false
        });

        walletReports[_targetWallet].push(newId);
        txHashToReportId[_txHash] = newId;

        emit ReportSubmitted(
            newId,
            _targetWallet,
            _txHash,
            _ipfsEvidenceCID,
            _aiRiskScore,
            msg.sender
        );

        return newId;
    }

    /**
     * @dev Update report resolution from DAO voting
     */
    function resolveReport(
        uint256 _reportId,
        ReportStatus _finalStatus,
        uint256 _yesVotes,
        uint256 _noVotes
    ) external onlyAuthorized {
        FraudReport storage report = reports[_reportId];
        require(report.reportId != 0, "Report does not exist");
        require(!report.isResolved, "Report already resolved");

        report.status = _finalStatus;
        report.yesVotes = _yesVotes;
        report.noVotes = _noVotes;
        report.isResolved = true;

        emit ReportStatusUpdated(_reportId, _finalStatus, _yesVotes, _noVotes);
    }

    function getReport(uint256 _reportId) external view returns (FraudReport memory) {
        return reports[_reportId];
    }

    function getReportsForWallet(address _wallet) external view returns (uint256[] memory) {
        return walletReports[_wallet];
    }
}
