// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IFraudRegistry {
    enum ReportStatus { Submitted, InReview, Verified, Rejected }
    function resolveReport(uint256 _reportId, ReportStatus _status, uint256 _yes, uint256 _no) external;
    function getReport(uint256 _reportId) external view returns (
        uint256 reportId,
        address targetWallet,
        bytes32 txHash,
        string memory ipfsEvidenceCID,
        uint8 aiRiskScore,
        string memory aiDiagnosisSummary,
        address reporter,
        uint256 timestamp,
        ReportStatus status,
        uint256 yesVotes,
        uint256 noVotes,
        bool isResolved
    );
}

interface IReputationContract {
    function recordVerifiedFraud(address _wallet, uint8 _penaltyPoints) external;
    function recordFalsePositive(address _wallet, address _reporter) external;
}

/**
 * @title FraudShieldDAO
 * @dev Manages decentralized validator verification quorum, voting, and triggers reputation updates.
 */
contract FraudShieldDAO {
    struct CaseVote {
        uint256 reportId;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 votingDeadline;
        bool finalized;
        mapping(address => bool) hasVoted;
        mapping(address => bool) voteChoice; // true = Fraud Verified, false = False Positive
    }

    address public owner;
    address public fraudRegistry;
    address public reputationContract;

    uint256 public constant QUORUM_VOTES_REQUIRED = 3;
    uint256 public constant VOTING_PERIOD = 3 days;

    mapping(address => bool) public isValidator;
    uint256 public totalValidators;

    mapping(uint256 => CaseVote) private caseVotes;

    event ValidatorAdded(address indexed validator);
    event ValidatorRemoved(address indexed validator);
    event VoteCast(uint256 indexed reportId, address indexed validator, bool supportFraud);
    event CaseFinalized(uint256 indexed reportId, bool isFraudVerified, uint256 yesVotes, uint256 noVotes);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call");
        _;
    }

    modifier onlyValidator() {
        require(isValidator[msg.sender], "Caller is not an active validator");
        _;
    }

    constructor(address _registry, address _reputation) {
        owner = msg.sender;
        fraudRegistry = _registry;
        reputationContract = _reputation;

        // Add deployer as first initial validator
        isValidator[msg.sender] = true;
        totalValidators = 1;
    }

    function addValidator(address _validator) external onlyOwner {
        require(!isValidator[_validator], "Already a validator");
        isValidator[_validator] = true;
        totalValidators++;
        emit ValidatorAdded(_validator);
    }

    function castVote(uint256 _reportId, bool _supportFraud) external onlyValidator {
        CaseVote storage cVote = caseVotes[_reportId];
        require(!cVote.finalized, "Case voting already finalized");
        require(!cVote.hasVoted[msg.sender], "Validator already voted on this case");

        if (cVote.votingDeadline == 0) {
            cVote.reportId = _reportId;
            cVote.votingDeadline = block.timestamp + VOTING_PERIOD;
        }

        cVote.hasVoted[msg.sender] = true;
        cVote.voteChoice[msg.sender] = _supportFraud;

        if (_supportFraud) {
            cVote.yesVotes++;
        } else {
            cVote.noVotes++;
        }

        emit VoteCast(_reportId, msg.sender, _supportFraud);

        // Check if quorum reached
        if (cVote.yesVotes + cVote.noVotes >= QUORUM_VOTES_REQUIRED) {
            _finalizeCase(_reportId);
        }
    }

    function _finalizeCase(uint256 _reportId) internal {
        CaseVote storage cVote = caseVotes[_reportId];
        cVote.finalized = true;

        bool isFraud = cVote.yesVotes > cVote.noVotes;

        (
            ,
            address targetWallet,
            ,
            ,
            uint8 aiRiskScore,
            ,
            address reporter,
            ,
            ,
            ,
            ,
        ) = IFraudRegistry(fraudRegistry).getReport(_reportId);

        if (isFraud) {
            IFraudRegistry(fraudRegistry).resolveReport(
                _reportId,
                IFraudRegistry.ReportStatus.Verified,
                cVote.yesVotes,
                cVote.noVotes
            );
            // Penalty proportional to AI risk score (min 30, max 70)
            uint8 penalty = aiRiskScore > 50 ? aiRiskScore / 2 + 20 : 35;
            IReputationContract(reputationContract).recordVerifiedFraud(targetWallet, penalty);
        } else {
            IFraudRegistry(fraudRegistry).resolveReport(
                _reportId,
                IFraudRegistry.ReportStatus.Rejected,
                cVote.yesVotes,
                cVote.noVotes
            );
            IReputationContract(reputationContract).recordFalsePositive(targetWallet, reporter);
        }

        emit CaseFinalized(_reportId, isFraud, cVote.yesVotes, cVote.noVotes);
    }

    function getVoteDetails(uint256 _reportId) external view returns (
        uint256 yesVotes,
        uint256 noVotes,
        uint256 deadline,
        bool finalized
    ) {
        CaseVote storage c = caseVotes[_reportId];
        return (c.yesVotes, c.noVotes, c.votingDeadline, c.finalized);
    }

    function hasValidatorVoted(uint256 _reportId, address _val) external view returns (bool) {
        return caseVotes[_reportId].hasVoted[_val];
    }
}
